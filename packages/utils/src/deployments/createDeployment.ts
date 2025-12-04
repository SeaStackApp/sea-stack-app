import { PrismaClient } from '@repo/db';

export const createDeployment = (prisma: PrismaClient, serviceId: string) => {
    return prisma.deployment.create({
        data: {
            serviceId: serviceId,
        },
    });
};

export type Deployment = NonNullable<
    Awaited<ReturnType<typeof createDeployment>>
>;
