import { Github } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { MobileNav } from './mobile-nav';

export function Header() {
    return (
        <header className='sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className=' mx-auto flex h-16 items-center justify-between px-4'>
                <div className='flex items-center gap-4'>
                    <MobileNav />
                    <Link href='/' className='hidden md:flex items-center'>
                        <span className='text-xl font-bold'>SeaStack</span>
                    </Link>
                </div>
                <div className='flex items-center gap-2'>
                    <Link
                        href='https://github.com/SeaStackApp/sea-stack-app'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='p-2 rounded-md hover:bg-muted transition-colors'
                        aria-label='GitHub'
                    >
                        <Github className='h-5 w-5' />
                    </Link>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
