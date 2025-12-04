import { inferProcedureOutput } from '@trpc/server';
import { appRouter } from '@repo/api';

export type Backup = inferProcedureOutput<
    typeof appRouter.services.backups.listBackups
>[number];
