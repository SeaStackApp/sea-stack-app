'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import NewOrganizationForm from '@/components/team-switcher/new-organization-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function TeamSwitcher() {
    const { data: organizations } = authClient.useListOrganizations();
    const { isMobile } = useSidebar();
    const { data: activeOrganization } = authClient.useActiveOrganization();
    const [showNewOrgModal, setShowNewOrgModal] = React.useState(false);

    if (organizations?.length === 0)
        return (
            <Dialog open={true} onOpenChange={() => {}}>
                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Welcome to SeaStack !</DialogTitle>
                        <DialogDescription>
                            You don't have an organization yet but don't worry,
                            you can create one in a few steps.
                        </DialogDescription>
                        <NewOrganizationForm />
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        );

    const activeOrganizationFallback =
        activeOrganization?.name
            .split(' ')
            .map((part) => part[0]?.toUpperCase() ?? '')
            .join('') ?? '';

    console.log(showNewOrgModal);

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size='lg'
                                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                            >
                                <Avatar className='size-8 rounded-lg'>
                                    <AvatarImage
                                        src={activeOrganization?.logo ?? ''}
                                        alt={activeOrganization?.name}
                                    />
                                    <AvatarFallback className='rounded-lg'>
                                        {activeOrganizationFallback}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='grid flex-1 text-left text-sm leading-tight'>
                                    <span className='truncate font-medium'>
                                        {activeOrganization?.name}
                                    </span>
                                </div>
                                <ChevronsUpDown className='ml-auto' />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                            align='start'
                            side={isMobile ? 'bottom' : 'right'}
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className='text-muted-foreground text-xs'>
                                Organizations
                            </DropdownMenuLabel>
                            {organizations?.map((organization, index) => (
                                <DropdownMenuItem
                                    key={organization.name}
                                    onClick={() =>
                                        authClient.organization.setActive({
                                            organizationId: organization.id,
                                        })
                                    }
                                    className='gap-2 p-2'
                                >
                                    <div className='flex size-6 items-center justify-center rounded-md border'></div>
                                    {organization.name}
                                    <DropdownMenuShortcut>
                                        ⌘{index + 1}
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className='gap-2 p-2'
                                onClick={() => setShowNewOrgModal(true)}
                            >
                                <div className='flex size-6 items-center justify-center rounded-md border bg-transparent'>
                                    <Plus className='size-4' />
                                </div>
                                <div className='text-muted-foreground font-medium'>
                                    Add organization
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
            <Dialog open={showNewOrgModal} onOpenChange={setShowNewOrgModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a new organization</DialogTitle>
                        <DialogDescription>
                            Organizations are where you can organize your
                            projects.
                        </DialogDescription>
                        <NewOrganizationForm
                            onCreate={() => setShowNewOrgModal(false)}
                        />
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}
