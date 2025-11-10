import { prisma } from '@repo/db';
import { decrypt } from '../crypto';

export default async function getBase64AuthForRegistry(registryId: string) {
    const registry = await prisma.registry.findUnique({
        where: {
            id: registryId,
        },
    });
    if (!registry) throw new Error('Registry not found');
    return Buffer.from(
        JSON.stringify({
            username: registry.username,
            password: decrypt(registry.password),
            serveraddress: registry.url,
        })
    ).toString('base64');
}
