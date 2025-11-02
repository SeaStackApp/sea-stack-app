import DashboardPage from '@/components/dashboard-page';
import ServerTerminal from '@/app/dashboard/servers/[serverId]/terminal/component/server-terminal';

export default async function ServerTerminalPage({
    params,
}: {
    readonly params: Promise<{
        serverId: string;
    }>;
}) {
    const { serverId } = await params;
    return (
        <DashboardPage>
            <div className='w-full aspect-video relative'>
                <ServerTerminal serverId={serverId} />
            </div>
        </DashboardPage>
    );
}
