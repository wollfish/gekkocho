import { auth } from '@/auth';
import {
    apiAuthPrefix,
    authRoutes,
    DEFAULT_LOGIN_REDIRECT,
    DEFAULT_PRIVATE_ROUTE,
    publicRoutes,
} from '@/routes';

export default auth((req) => {
    const { nextUrl } = req;

    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isPrivateRoute = nextUrl.pathname.startsWith(DEFAULT_PRIVATE_ROUTE);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute || isPublicRoute) {
        return null;
    }

    if (isLoggedIn && isAuthRoute) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    if (isLoggedIn && isPrivateRoute) {
        return null;
    }

    if (!isLoggedIn && isAuthRoute) {
        return null;
    }

    if (!isLoggedIn && isPrivateRoute) {
        let callbackUrl = nextUrl.pathname;

        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);

        return Response.redirect(new URL(
            `/login?callbackUrl=${encodedCallbackUrl}`,
            nextUrl
        ));
    }

    return null;
});

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|images/|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
