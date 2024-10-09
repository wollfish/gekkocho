'use server';

import { isRedirectError } from 'next/dist/client/components/redirect';

import { doLogout } from '@/actions/auth';
import { auth } from '@/auth';
import { createServerAction, ServerActionError } from '@/lib/server-utils';
import { UserInterface } from '@/lib/zod';

export const getProfile = createServerAction<UserInterface>(async () => {
    const session = await auth();

    try {

        //Todo: Remove temporary token
        const barongSession = 'temp_token';

        // const barongSession = await decryptToken(session.user?.access_token);

        if (!session?.user || !barongSession) {
            await doLogout();
            throw new ServerActionError('User is not authenticated.');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/barong/resource/users/me`, {
            headers: {
                'Cookie': `_barong_session=${barongSession}`,
            },
            cache: 'no-store',
        });

        const data = await response.json();

        console.warn('profile - data', data);

        if (!response.ok) {
            throw new ServerActionError('Unable to fetch profile.');
        }

        return data;
    } catch (e) {
        if (isRedirectError(e)) throw e;
        if (e instanceof ServerActionError) throw e;

        console.warn('An error occurred in getProfile:', e);
        throw new ServerActionError('Unknown error occurred.');
    }
});
