import db from '@/db';
import { publicProcedure, router } from './trpc';
import { z } from 'zod';

export const appRouter = router({
  getCriteria: publicProcedure.query(async ({ ctx }) => {
    // const { userId } = ctx;
    return await db.criteria.findFirst({
      where: {
        userId: 1, // hard coded for now
      },
      include: {
        criterion: true,
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
});
export type AppRouter = typeof appRouter;
