import { ReactNode } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import packageJSON from 'package.json';
import { FieldDescription } from '@/components/ui/field';
import { cn } from '@/lib/utils';

export default function DashboardPage({
    children,
    className,
}: Readonly<{
    children: ReactNode;
    className?: string;
}>) {
    return (
        <>
            <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
                <div className='flex items-center gap-2 px-4'>
                    <SidebarTrigger className='-ml-1' />
                    <Separator
                        orientation='vertical'
                        className='mr-2 data-[orientation=vertical]:h-4'
                    />
                </div>
            </header>
            <Separator />
            <main className={cn('p-6 py-6', className)}>{children}</main>
            <FieldDescription className='p-6 text-center'>
                SeaStack version {packageJSON.version}
            </FieldDescription>
        </>
    );
}
