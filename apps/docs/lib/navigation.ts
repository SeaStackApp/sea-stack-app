export interface NavItem {
    title: string;
    href: string;
    items?: NavItem[];
}

export const navigation: NavItem[] = [
    {
        title: 'Getting Started',
        href: '/docs',
        items: [
            { title: 'Introduction', href: '/docs' },
            { title: 'Quick Start', href: '/docs/quick-start' },
            { title: 'Local development', href: '/docs/local-development' },
        ],
    },
];
