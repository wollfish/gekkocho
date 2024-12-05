import { parse } from 'cookie';

export const getCookiesFromHeader = (cookieHeader: string) => {
    const parsedCookie = parse(cookieHeader);

    if (!parsedCookie) return [];

    const [cookieName, cookieValue] = Object.entries(parsedCookie)[0];

    return [{
        name: cookieName,
        value: cookieValue,
        expires_at: new Date(parsedCookie.expires),
    }];
};

export const getAccessTokenFromHeader = (header: string, tokenName: string) => {
    return getCookiesFromHeader(header).find((cookie) => cookie.name === tokenName) || {};
};
