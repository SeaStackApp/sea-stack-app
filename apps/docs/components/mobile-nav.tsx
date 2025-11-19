'use client'

import { Menu } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { navigation, type NavItem } from '@/lib/navigation'

function MobileNavGroup({ item, onClose }: Readonly<{ item: NavItem; onClose: () => void }>) {
    const pathname = usePathname()

    return (
        <div className="mb-6">
            <h3 className="mb-2 px-3 text-sm font-semibold text-foreground">
                {item.title}
            </h3>
            <ul className="space-y-1">
                {item.items?.map((subItem) => {
                    const isActive = pathname === subItem.href
                    return (
                        <li key={subItem.href}>
                            <Link
                                href={subItem.href}
                                onClick={onClose}
                                className={cn(
                                    'block px-3 py-1.5 text-sm rounded-md transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground font-medium'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                )}
                            >
                                {subItem.title}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="Open menu"
            >
                <Menu className="h-5 w-5" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="fixed top-0 left-0 z-50 h-screen w-64 bg-card border-r border-border overflow-y-auto md:hidden">
                        <div className="px-6 py-8">
                            <div className="flex items-center justify-between mb-8">
                                <Link
                                    href="/"
                                    className="text-2xl font-bold"
                                    onClick={() => setIsOpen(false)}
                                >
                                    SeaStack
                                </Link>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-md hover:bg-muted"
                                    aria-label="Close menu"
                                >
                                    ✕
                                </button>
                            </div>
                            <nav>
                                {navigation.map((item) => (
                                    <MobileNavGroup
                                        key={item.href}
                                        item={item}
                                        onClose={() => setIsOpen(false)}
                                    />
                                ))}
                            </nav>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
