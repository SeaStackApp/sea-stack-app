'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => setMounted(true), 0)
        return () => clearTimeout(timeout)
    }, [])

    if (!mounted) {
        return (
            <button
                className="p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="Toggle theme"
            >
                <Sun className="h-5 w-5" />
            </button>
        )
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={cn(
                'p-2 rounded-md hover:bg-muted transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-ring'
            )}
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </button>
    )
}
