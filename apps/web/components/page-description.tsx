import { ReactNode } from 'react';

export default function PageDescription({
    children,
}: Readonly<{ children: ReactNode }>) {
    return <p className='text-muted-foreground text-balance'>{children}</p>;
}
