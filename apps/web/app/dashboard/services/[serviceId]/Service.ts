import { inferProcedureOutput } from '@trpc/server';
import { appRouter } from '@repo/api';

export type Service = NonNullable<
    inferProcedureOutput<typeof appRouter.services.getService>
>;
