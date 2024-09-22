'use server';

import { isRedirectError } from 'next/dist/client/components/redirect';

import { doLogout } from '@/actions/auth';
import { auth } from '@/auth';
import { decryptToken } from '@/lib/encryption';
import { createServerAction, ServerActionError } from '@/lib/server-utils';
import { UserInterface } from '@/lib/zod';

export const getProfile = createServerAction<UserInterface>(async () => {
    try {
        const session = await auth();
        const barongSession = await decryptToken(session.user.access_token);

        if (!session || !session.user) {
            await doLogout();
            throw new ServerActionError('User is not authenticated.');
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

        console.warn('An error occurred in getProfile:', e.message);
        throw new ServerActionError('Unknown error occurred.');
    }
});
