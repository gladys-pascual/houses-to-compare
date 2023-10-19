import db from '@/db';
import { publicProcedure, privateProcedure, router } from './trpc';
import { z } from 'zod';
import { Criterion, House } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError } from '@trpc/server';

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if (!user.id || !user.email) throw new TRPCError({ code: 'UNAUTHORIZED' });

    // check if user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      // create user in db
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.given_name ?? 'friend',
        },
      });
    }

    return { success: true };
  }),

  getCriteria: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    // check if user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!dbUser) throw new TRPCError({ code: 'UNAUTHORIZED' });

    return await db.criteria.findFirst({
      where: {
        userId,
      },
      include: {
        criterion: true,
      },
    });
  }),

  getCriterionScores: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    // check if user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!dbUser) throw new TRPCError({ code: 'UNAUTHORIZED' });

    return db.criterionScore.findMany({
      where: {
        userId,
      },
      include: {
        house: true,
      },
    });
  }),

  createCriterion: privateProcedure
    .input(
      z.object({
        factor: z.string(),
        weight: z.number(),
      })
    )
    .mutation(async (opts) => {
      const { input, ctx } = opts;
      const { userId } = ctx;

      // check if user is in the database
      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser) throw new TRPCError({ code: 'UNAUTHORIZED' });

      const criterion = await db.criterion.create({
        data: {
          factor: input.factor,
          weight: input.weight,
          criteria: {
            connectOrCreate: {
              create: {
                userId: userId,
              },
              where: {
                userId: userId,
              },
            },
          },
        },
      });

      return criterion;
    }),

  createCriterionScores: privateProcedure
    .input(
      z.object({
        criterionScores: z.array(
          z.object({ criterionId: z.number(), criterionScore: z.number() })
        ),
        houseAddress: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input, ctx } = opts;
      const { houseAddress, criterionScores } = input;
      const { userId } = ctx;

      // check if user is in the database
      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (!dbUser) throw new TRPCError({ code: 'UNAUTHORIZED' });

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

      return house;
    }),

  getHousesScore: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    // check if user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!dbUser) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const criterionScores = await db.criterionScore.findMany({
      where: {
        userId,
      },
      include: {
        house: true,
      },
    });

    const criteria = await db.criteria.findFirst({
      where: {
        userId,
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
