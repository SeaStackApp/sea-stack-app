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
            { title: 'Installation', href: '/docs/installation' },
            { title: 'Local development', href: '/docs/local-development' },
        ],
    },
];
