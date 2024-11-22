import { Icons } from '@/components/icons';

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: 'CoinDhan Pay',
    description: 'Coindhan Pay: A simple and secure crypto payment gateway for your business.',
    navItems: [
        {
            label: 'Home',
            href: '/',
        },
        {
            label: 'Docs',
            href: '/docs',
        },
        {
            label: 'Pricing',
            href: '/pricing',
        },
        {
            label: 'Blog',
            href: '/blog',
        },
        {
            label: 'About',
            href: '/about',
        },
    ],
    navMenuItems: [
        {
            label: 'Profile',
            href: '/profile',
        },
        {
            label: 'Dashboard',
            href: '/dashboard',
        },
        {
            label: 'Projects',
            href: '/projects',
        },
        {
            label: 'Team',
            href: '/team',
        },
        {
            label: 'Calendar',
            href: '/calendar',
        },
        {
            label: 'Settings',
            href: '/settings',
        },
        {
            label: 'Help & Feedback',
            href: '/help-feedback',
        },
        {
            label: 'Logout',
            href: '/logout',
        },
    ],
    dashboardSideNavItems: [
        {
            label: 'Home',
            href: '/',
            icon: Icons.home,
        },
        {
            label: 'Dashboard',
            href: '/dashboard',
            icon: Icons.dashboard,
        },
        {
            label: 'Profile',
            href: '/dashboard/profile',
            icon: Icons.userCog,
        },
        {
            label: 'Wallet',
            href: '/dashboard/wallet',
            icon: Icons.wallet,
        },
        {
            label: 'Payments',
            href: '/dashboard/payments',
            icon: Icons.calendar,
        },
        {
            label: 'Settings',
            href: '/dashboard/settings',
            icon: Icons.settings,
        },
    ],
    dashboardSettingsNavItems: [
        {
            label: 'General',
            path: '/dashboard/settings/general',
        },
        {
            label: 'Security',
            path: '/dashboard/settings/security',
        },
        {
            label: 'KYC',
            path: '/dashboard/settings/kyc',
        },
    ],
    dashboardPaymentNavItems: [
        {
            label: 'Overview',
            path: '/dashboard/payments',
        },
        {
            label: 'Payments',
            path: '/dashboard/payments/list',
        },
    ],
    dashboardWalletNavItems: [
        {
            label: 'Overview',
            path: '/dashboard/wallet',
        },
        {
            label: 'Beneficiaries',
            path: '/dashboard/wallet/beneficiaries',
        },
    ],
    links: {
        github: 'https://github.com/nextui-org/nextui',
        twitter: 'https://twitter.com/getnextui',
        docs: 'https://nextui.org',
        discord: 'https://discord.gg/9b6yyZKmH4',
    },
};
