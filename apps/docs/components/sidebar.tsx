'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { navigation, type NavItem } from '@/lib/navigation'

function NavGroup({ item }: Readonly<{ item: NavItem }>) {
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

export function Sidebar() {
    return (
        <aside className="fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card overflow-y-auto">
            <div className="px-6 py-8">
                <nav>
                    {navigation.map((item) => (
                        <NavGroup key={item.href} item={item} />
                    ))}
                </nav>
            </div>
        </aside>
    )
}
