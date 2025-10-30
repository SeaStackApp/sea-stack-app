import { appRouter, createContext } from '@repo/api';

export default async function Home() {
    const caller = appRouter.createCaller(await createContext());
    const health = await caller.health.ping();
    const users = await caller.user.list();

    return (
        <main style={{ padding: 24 }}>
            <h1>SEA Stack App</h1>
            <h2>tRPC Health</h2>
            <pre>{JSON.stringify(health, null, 2)}</pre>

            <h2>Users</h2>
            <pre>{JSON.stringify(users, null, 2)}</pre>
            <p>
                The above data was fetched on the server via tRPC caller using
                the shared router.
            </p>
        </main>
    );
}
