import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import React from 'react';
import DashboardPage from '@/components/dashboard-page';

export default function DashboardLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <DashboardPage children={children} />
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
