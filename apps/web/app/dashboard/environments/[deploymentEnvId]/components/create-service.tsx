import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import * as React from 'react';
import CreateSwarmAppForm from '@/app/dashboard/environments/[deploymentEnvId]/components/create-swarm-app-form';

export const CreateService = ({
    envirommentId,
}: Readonly<{
    envirommentId: string;
}>) => {
    const [showSwarmAppModal, setShowSwarmAppModal] = useState(false);
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>Add service</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end'>
                    <DropdownMenuItem
                        onClick={() => setShowSwarmAppModal(true)}
                    >
                        Swarm Application
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
                open={showSwarmAppModal}
                onOpenChange={setShowSwarmAppModal}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Create a new Swarm Application
                        </DialogTitle>
                        <DialogDescription>
                            Create a swarm application from a docker image.
                        </DialogDescription>
                        <CreateSwarmAppForm
                            environmentId={envirommentId}
                            onCreate={() => setShowSwarmAppModal(false)}
                        />
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
};
