import { parse } from 'cookie';

export type ServerActionResult<T> =
    | { success: true; value: T }
    | { success: false; error: string };

export class ServerActionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ServerActionError';
    }
}

export function createServerAction<Return, Args extends unknown[] = []>(
    callback: (...args: Args) => Promise<Return>
): (...args: Args) => Promise<ServerActionResult<Return>> {
    return async (...args: Args) => {
        try {
            const value = await callback(...args);

            return { success: true, value };
        } catch (error) {
            if (error instanceof ServerActionError)
                return { success: false, error: error.message };
            throw error;
        }
    };
}

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
