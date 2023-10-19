import db from '@/db';
import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import USER_ID from '@/USER_ID';
import { Criterion, House } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export const appRouter = router({
  getCriteria: publicProcedure.query(async () => {
    return await db.criteria.findFirst({
      where: {
        userId: USER_ID,
      },
      include: {
        criterion: true,
      },
    });
  }),

  getCriterionScores: publicProcedure.query(async () => {
    return db.criterionScore.findMany({
      where: {
        userId: USER_ID,
      },
      include: {
        house: true,
      },
    });
  }),

  createCriterion: publicProcedure
    .input(
      z.object({
        factor: z.string(),
        weight: z.number(),
        userId: z.number(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;

      const criterion = await db.criterion.create({
        data: {
          factor: input.factor,
          weight: input.weight,
          criteria: {
            connectOrCreate: {
              create: {
                userId: input.userId,
              },
              where: {
                userId: input.userId,
              },
            },
          },
        },
      });

      return criterion;
    }),
  createCriterionScores: publicProcedure
    .input(
      z.object({
        criterionScores: z.array(
          z.object({ criterionId: z.number(), criterionScore: z.number() })
        ),
        houseAddress: z.string(),
        userId: z.number(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const { userId, houseAddress, criterionScores } = input;

      const house = await db.house.findUnique({
        where: {
          address: houseAddress,
        },
      });

      if (!house) {
        await db.house.create({
          data: {
            address: houseAddress,
          },
        });
      }

      const dataToPass = criterionScores.map((criterionScore) => ({
        userId: userId,
        houseAddress: houseAddress,
        criterionId: criterionScore.criterionId,
        criterionScore: criterionScore.criterionScore,
      }));

      const criterionScore = await db.criterionScore.createMany({
        data: dataToPass,
      });

      return criterionScore;
    }),

  getHousesScore: publicProcedure.query(async () => {
    const criterionScores = await db.criterionScore.findMany({
      where: {
        userId: USER_ID,
      },
      include: {
        house: true,
      },
    });

    const criteria = await db.criteria.findFirst({
      where: {
        userId: USER_ID,
      },
      include: {
        criterion: true,
      },
    });

    const criterionList = criteria?.criterion;

    /**
     * {
     *  [criterionId]: criterionObject
     * }
     */
    const criterionDictionary = (criterionList ?? []).reduce(
      (acc, curr) => ({
        ...acc,
        [curr.id]: curr,
      }),
      {} as Record<string, Criterion>
    );

    /**
     * {
     *    "houseAddress": {
     *     id: number,
     *     address: string,
     *     link: string | null
     *    }
     * }
     */
    const houseAddressDictionary = criterionScores.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.houseAddress]: curr.house,
      };
    }, {} as Record<string, House>);

    /**
     * {
     *    "houseAddress": [
     *      {
     *      criterionId: number,
     *     criterionScore: number,
     *     weight: number,
     *     factor: string
     *      }
     *    ],
     * }[]
     */

    type ScoreDetail = {
      criterionId: number;
      criterionScore: number;
      weight: Decimal;
      factor: string;
    };

    const scoreDetailsByHouse = criterionScores.reduce((acc, curr) => {
      const scoreDetail = {
        criterionId: curr.criterionId,
        criterionScore: curr.criterionScore,
        weight: criterionDictionary[curr.criterionId].weight,
        factor: criterionDictionary[curr.criterionId].factor,
      };

      // if the house address isn't there
      if (!acc.hasOwnProperty(curr.houseAddress)) {
        return {
          ...acc,
          [curr.houseAddress]: [scoreDetail],
        };
      }

      // acc[curr.houseAddress].push(scoreDetail)
      // return acc

      return {
        ...acc,
        [curr.houseAddress]: [...acc[curr.houseAddress], scoreDetail],
      };
    }, {} as Record<string, ScoreDetail[]>);

    const sortByScore = (a: { score: number }, b: { score: number }) => {
      return b.score - a.score;
    };

    const housesScore = Object.entries(scoreDetailsByHouse)
      .map(([houseAddress, scoreDetails]) => {
        return {
          house: houseAddressDictionary[houseAddress],
          scoreDetails,
          score: scoreDetails.reduce((acc, curr) => {
            const score =
              ((+curr.weight / 10) * curr.criterionScore) / scoreDetails.length;

            return acc + score;
          }, 0),
        };
      })
      .sort(sortByScore);

    return housesScore;
  }),
});
export type AppRouter = typeof appRouter;
