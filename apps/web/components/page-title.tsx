import { ReactNode } from 'react';

export default function PageTitle({
    children,
}: Readonly<{ children: ReactNode }>) {
    return <h2 className='text-2xl font-bold'>{children}</h2>;
}
