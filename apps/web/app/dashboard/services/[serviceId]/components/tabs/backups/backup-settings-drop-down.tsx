import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontalIcon } from 'lucide-react';
import { ButtonGroup } from '@/components/ui/button-group';
import { Backup } from '@/app/dashboard/services/[serviceId]/components/tabs/backups/Backup';
import { useTRPC } from '@/lib/trpc';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

export default function BackupSettingsDropDown({
    backup,
}: Readonly<{ backup: Backup }>) {
    const trpc = useTRPC();
    const startBackupMutation = useMutation(
        trpc.services.backups.startBackup.mutationOptions()
    );
    return (
        <ButtonGroup>
            <Button
                variant='secondary'
                onClick={async () => {
                    try {
                        await startBackupMutation.mutateAsync({
                            volumeBackupScheduleId: backup.id,
                        });
                    } catch (error) {
                        console.error(error);
                        toast.error('Unable to start backup.');
                    }
                }}
                disabled={startBackupMutation.isPending}
            >
                {startBackupMutation.isPending ? <Spinner /> : 'Backup now'}
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='secondary'>
                        <MoreHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='start'>
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Status</DropdownMenuLabel>
                        <DropdownMenuItem variant='destructive'>
                            {backup.isActive
                                ? 'Disable backup schedule'
                                : 'Enable backup schedule'}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant='destructive'>
                        Delete backup schedule
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </ButtonGroup>
    );
}
