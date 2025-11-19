'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

const GITHUB_EDIT_BASE =
    'https://github.com/SeaStackApp/sea-stack-app/edit/main/apps/docs/app';

export function EditThisPage() {
    const pathname = usePathname();

    if (!pathname || !pathname.startsWith('/docs')) return null;

    const filePath =
        pathname === '/docs' ? '/docs/page.mdx' : `${pathname}/page.mdx`;

    const href = `${GITHUB_EDIT_BASE}${filePath}`;

    return (
        <div className='mt-8 flex justify-center'>
            <a
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                className='text-sm text-gray-500 hover:text-gray-700 underline underline-offset-4'
            >
                Edit this page on GitHub
            </a>
        </div>
    );
}
