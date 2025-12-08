import { PrismaClient } from '@repo/db';

export const getS3Storage = async (
    prisma: PrismaClient,
    destinationId: string
) => {
    const s3 = await prisma.s3Storage.findFirst({
        where: { id: destinationId },
    });

    if (!s3) {
        throw new Error(
            `Could not find S3 storage destination ${destinationId}`
        );
    }

    return s3;
};

export type S3Storage = NonNullable<Awaited<ReturnType<typeof getS3Storage>>>;
