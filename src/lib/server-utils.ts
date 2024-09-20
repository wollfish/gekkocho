import { parse } from 'cookie';
import { cookies } from 'next/headers';

export const setAuthCookie = (cookieHeader: string) => {
    if (!cookieHeader) return;

    const parsedCookie = parse(cookieHeader);
    const [cookieName, cookieValue] = Object.entries(parsedCookie)[0];

    cookies().set({
        name: cookieName,
        value: cookieValue,
        httpOnly: true,
        maxAge: parseInt(parsedCookie['Max-Age']),
        path: parsedCookie.path,
        sameSite: parsedCookie.samesite as any,
        expires: new Date(parsedCookie.expires),
        secure: true,
    });
};

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
