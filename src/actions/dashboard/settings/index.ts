'use server';

import { isRedirectError } from 'next/dist/client/components/redirect';

import { DefaultSession, User } from 'next-auth';

import { doLogout } from '@/actions/auth';
import { auth } from '@/auth';
import { createServerAction, ServerActionError } from '@/lib/server-utils';
import { UserInterface } from '@/lib/zod';

interface SessionExtension extends DefaultSession {
    user: User & {
        access_token: string
    };
}
export const getProfile = createServerAction<UserInterface>(async () => {
    try {
        const session = await auth() as SessionExtension;
        const barongSession = session.user.access_token;

        if (!barongSession) {
            await doLogout();
            throw new ServerActionError('Access token not found.');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/barong/resource/users/me`, {
            headers: {
                'Cookie': `_barong_session=${barongSession}`,
            },
            cache: 'no-store',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new ServerActionError('Unable to fetch profile.');
        }

        return data;
    } catch (e) {
        if (isRedirectError(e)) throw e;
        if (e instanceof ServerActionError) throw e;

        console.warn(e);
        throw new ServerActionError('Unknown error occurred.');
    }
});
