import { publicProcedure, router } from '../trpc';

export const userRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users;
  }),
});
