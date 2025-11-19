export interface NavItem {
    title: string
    href: string
    items?: NavItem[]
}

export const navigation: NavItem[] = [
    {
        title: 'Getting Started',
        href: '/docs',
        items: [
            { title: 'Introduction', href: '/docs' },
            { title: 'Quick Start', href: '/docs/quick-start' },
            { title: 'Installation', href: '/docs/installation' },
        ],
    },
    {
        title: 'Architecture',
        href: '/docs/architecture',
        items: [
            { title: 'Overview', href: '/docs/architecture' },
            { title: 'Monorepo Structure', href: '/docs/architecture/monorepo' },
            { title: 'Tech Stack', href: '/docs/architecture/tech-stack' },
        ],
    },
    {
        title: 'Server Management',
        href: '/docs/servers',
        items: [
            { title: 'Overview', href: '/docs/servers' },
            { title: 'Adding Servers', href: '/docs/servers/adding' },
            { title: 'SSH Configuration', href: '/docs/servers/ssh' },
            { title: 'Remote Terminal', href: '/docs/servers/terminal' },
        ],
    },
    {
        title: 'Deployment',
        href: '/docs/deployment',
        items: [
            { title: 'Overview', href: '/docs/deployment' },
            { title: 'Docker Swarm', href: '/docs/deployment/swarm' },
            { title: 'Traefik Integration', href: '/docs/deployment/traefik' },
        ],
    },
    {
        title: 'Development',
        href: '/docs/development',
        items: [
            { title: 'Setup', href: '/docs/development' },
            { title: 'API Reference', href: '/docs/development/api' },
            { title: 'Contributing', href: '/docs/development/contributing' },
        ],
    },
]
