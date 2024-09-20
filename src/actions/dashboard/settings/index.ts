'use server';

import { cookies } from 'next/headers';

import { createServerAction, ServerActionError } from '@/lib/server-utils';
import { UserInterface } from '@/lib/zod';

export const getProfile = createServerAction<UserInterface>(async () => {
    try {
        const cookieStore = cookies();
        const barongSession = cookieStore.get('_barong_session')?.value;

        if (!barongSession) {
            return  new ServerActionError('User is not authenticated.');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/barong/resource/users/me`, {
            headers: {
                'Cookie': `_barong_session=${barongSession}`,
            },
            cache: 'no-store',
        });

        const data = await response.json();

        if (!response.ok) {
            return  new ServerActionError('Unable to fetch profile.');
        }

        return data;
    } catch (e) {
        if (e instanceof ServerActionError) throw e;
        throw new ServerActionError('Unable to fetch profile.');
    }
});
