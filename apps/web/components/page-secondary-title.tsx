import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export default function PageSecondaryTitle({
    children,
    className,
}: Readonly<{ children: ReactNode; className?: string }>) {
    return (
        <h3 className={cn('text-xl font-semibold mt-3 mb-1', className)}>
            {children}
        </h3>
    );
}
