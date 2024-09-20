export const publicRoutes: string[] = [
    '/',
    '/docs',
    '/pricing',
];

export const authRoutes: string[] = [
    '/login',
    '/account/register',
    '/account/forgot-password',
    '/account/verify-phone',
];

export const privateRoutes: string[] = [
    '/dashboard',
    '/dashboard/profile',
];

export const apiAuthPrefix: string = '/api/auth';

export const DEFAULT_LOGIN_REDIRECT: string = '/dashboard';
