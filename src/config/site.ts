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
            label: 'Contact Us',
            href: '/contact-us',
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
            label: 'Wallet',
            href: '/dashboard/wallet',
            icon: Icons.wallet,
        },
        {
            label: 'Withdrawals',
            href: '/dashboard/wallet/withdrawals',
            icon: Icons.send,
        },
        {
            label: 'Beneficiaries',
            href: '/dashboard/wallet/beneficiaries',
            icon: Icons.dice,
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
            label: 'Withdrawals',
            path: '/dashboard/wallet/withdrawals',
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

export const contactUsOptions = {
    industry: [
        { label: 'Creator Economy Platform', value: 'creator_economy_platform' },
        { label: 'Digital Goods', value: 'digital_goods' },
        { label: 'E-Commerce / Marketplace', value: 'e_commerce_marketplace' },
        { label: 'Gaming', value: 'gaming' },
        { label: 'HR and Payroll Services', value: 'hr_payroll_services' },
        { label: 'iGaming', value: 'igaming' },
        { label: 'Import / Export', value: 'import_export' },
        { label: 'IT Solutions', value: 'it_solutions' },
        { label: 'Luxury (Fashion, Cars, Furniture...)', value: 'luxury' },
        { label: 'Payment Orchestrator', value: 'payment_orchestrator' },
        { label: 'Payment Service Provider', value: 'payment_service_provider' },
        { label: 'Professional Services', value: 'professional_services' },
        { label: 'Real Estate', value: 'real_estate' },
        { label: 'Social Media / Streaming', value: 'social_media_streaming' },
        { label: 'Trading / Exchanges', value: 'trading_exchanges' },
        { label: 'Travel & Tourism', value: 'travel_tourism' },
        { label: 'Wallet / Neobank / EMI', value: 'wallet_neobank_emi' },
        { label: 'Web3', value: 'web3' },
        { label: 'Other', value: 'other' },
    ],
};
