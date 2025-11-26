'use client';

import * as React from 'react';
import {
    BellRingIcon,
    ContainerIcon,
    FolderOpenIcon,
    KeyIcon,
    NetworkIcon,
    ServerIcon,
    UsersIcon,
} from 'lucide-react';

import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';

const data = [
    {
        name: 'Quick Access',
        items: [
            {
                name: 'Projects',
                url: '/dashboard/projects',
                icon: FolderOpenIcon,
            },
        ],
    },
    {
        name: 'Settings',
        items: [
            {
                name: 'Servers',
                url: '/dashboard/servers',
                icon: ServerIcon,
            },
            {
                name: 'Networks',
                url: '/dashboard/networks',
                icon: NetworkIcon,
            },
            {
                name: 'Members',
                url: '/dashboard/settings/members',
                icon: UsersIcon,
            },
            {
                name: 'SSH Keys',
                url: '/dashboard/settings/ssh-keys',
                icon: KeyIcon,
            },
            {
                name: 'Docker registries',
                url: '/dashboard/settings/registries',
                icon: ContainerIcon,
            },

            {
                name: 'Notifications',
                url: '/dashboard/settings/notifications',
                icon: BellRingIcon,
            },
        ],
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: session } = authClient.useSession();
    return (
        <Sidebar collapsible='offcanvas' {...props}>
            <SidebarHeader>
                <TeamSwitcher />
            </SidebarHeader>
            <SidebarContent>
                {data.map((group) => {
                    return (
                        <SidebarGroup
                            className='group-data-[collapsible=icon]:hidden'
                            key={group.name}
                        >
                            <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton asChild>
                                            <a href={item.url}>
                                                <item.icon />
                                                <span>{item.name}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                    );
                })}
            </SidebarContent>
            {session && (
                <SidebarFooter>
                    <NavUser user={session.user} />
                </SidebarFooter>
            )}
            <SidebarRail />
        </Sidebar>
    );
}
