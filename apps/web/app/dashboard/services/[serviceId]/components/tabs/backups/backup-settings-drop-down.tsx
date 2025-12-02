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

export default function BackupSettingsDropDown({
    backup,
}: Readonly<{ backup: Backup }>) {
    return (
        <ButtonGroup>
            <Button variant='secondary'>Backup now</Button>
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
