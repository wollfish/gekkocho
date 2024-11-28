'use server';

import { isRedirectError } from 'next/dist/client/components/redirect';

import { doLogout } from '@/actions/auth';
import { auth } from '@/auth';
import { ApiResponse, makeApiRequest } from '@/lib/api';
import { decryptToken } from '@/lib/encryption';
import { createServerAction, ServerActionError } from '@/lib/server-utils';
import { TwoFactorAuthFormInterface, twoFactorAuthFormSchema, UserInterface } from '@/lib/zod';

export const getProfile = createServerAction<UserInterface>(async () => {
    const session = await auth();

    try {

        const barongSession = await decryptToken(session.user?.access_token);

        if (!session?.user || !barongSession) {
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

export async function toggleTwoFactor(formData: TwoFactorAuthFormInterface): Promise<ApiResponse> {
    const validatedFormData = twoFactorAuthFormSchema.safeParse(formData);

    if (!validatedFormData.success) {
        return {
            success: false,
            error: validatedFormData.error.message,
            data: null,
        };
    }

    return await makeApiRequest({
        endpoint: `/resource/otp/${validatedFormData.data.status}`,
        apiVersion: 'barong',
        method: 'POST',
        payload: validatedFormData.data,
        pathToRevalidate: ['/dashboard/settings/security'],
    });
}

export async function generateTwoFactorSecret(): Promise<ApiResponse> {
    console.log('Making request');

    return await makeApiRequest({
        endpoint: '/resource/otp/generate_qrcode',
        apiVersion: 'barong',
        method: 'POST',
    });
} 
