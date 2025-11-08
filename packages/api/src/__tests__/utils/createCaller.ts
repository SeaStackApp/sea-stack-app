import { t } from '../../trpc';
import { appRouter } from '../../root';

export const createCaller = t.createCallerFactory(appRouter);
