import { publicProcedure, router } from './trpc';
export const appRouter = router({
  test: publicProcedure.query(() => {
    return 'OLA';
  }),
});
export type AppRouter = typeof appRouter;
