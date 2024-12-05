import { Icons } from '@/components/icons';

export type SiteConfig = typeof siteConfig;

export const PLATFORM_USER_CURRENCY = 'AED';
export const PLATFORM_MAIN_CURRENCY = 'USDT';

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
        // {
        //     label: 'Pricing',
        //     href: '/pricing',
        // },
        // {
        //     label: 'Blog',
        //     href: '/blog',
        // },
        {
            label: 'About',
            href: '/about',
        },
    ],
    navMenuItems: [
        {
            label: 'Home',
            href: '/',
        },
        {
            label: 'Contact Us',
            href: '/contact-us',
        },
        {
            label: 'Login',
            href: '/login',
        },
        {
            label: 'Logout',
            href: '/logout',
        },
    ],
    dashboardSideNavItems: [
        // {
        //     label: 'Home',
        //     href: '/',
        //     icon: Icons.home,
        // },
        {
            label: 'Dashboard',
            href: '/dashboard',
            icon: Icons.dashboard,
        },
        {
            label: 'Balances',
            href: '/dashboard/account',
            icon: Icons.wallet,
        },
        {
            label: 'Withdrawals',
            href: '/dashboard/account/withdrawals',
            icon: Icons.send,
        },
        {
            label: 'Beneficiaries',
            href: '/dashboard/account/beneficiaries',
            icon: Icons.dice,
        },
        {
            label: 'Payments',
            href: '/dashboard/payments/list',
            icon: Icons.arrowRightLeft,
        }, {
            label: 'Payment Links',
            href: '/dashboard/payments/links',
            icon: Icons.qrCode,
        },
        {
            label: 'Settings',
            href: '/dashboard/settings/general',
            icon: Icons.settings,
        },
        {
            label: 'APIs',
            href: '/dashboard/settings/api',
            icon: Icons.gitMerge,
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
            label: 'APIs',
            path: '/dashboard/settings/api',
        },
        {
            label: 'KYC',
            path: '/dashboard/settings/kyc',
        },
    ],
    dashboardPaymentNavItems: [
        {
            label: 'Payments',
            path: '/dashboard/payments/list',
        },
        {
            label: 'Active Payment Links',
            path: '/dashboard/payments/links',
        },
    ],
    dashboardAccountNavItems: [
        {
            label: 'Balances',
            path: '/dashboard/account',
        },
        {
            label: 'Withdrawals',
            path: '/dashboard/account/withdrawals',
        },
        {
            label: 'Beneficiaries',
            path: '/dashboard/account/beneficiaries',
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
        { label: 'Account / Neobank / EMI', value: 'account_neobank_emi' },
        { label: 'Web3', value: 'web3' },
        { label: 'Other', value: 'other' },
    ],
};
