'use server';

import { isRedirectError } from 'next/dist/client/components/redirect';

import { doLogout } from '@/actions/auth';
import { auth } from '@/auth';
import { ApiResponse, makeApiRequest } from '@/lib/api';
import { decryptToken } from '@/lib/encryption';
import { createServerAction, ServerActionError } from '@/lib/server-utils';
import {
    ApiKeyFormInterface, ApiKeyResponseInterface,
    TwoFactorAuthFormInterface,
    TwoFactorAuthResponseInterface,
    UserInterface,
} from '@/lib/zod';

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

export async function toggleTwoFactor(payload: TwoFactorAuthFormInterface): Promise<ApiResponse> {
    return await makeApiRequest({
        endpoint: `/resource/otp/${payload.status}`,
        apiVersion: 'barong',
        method: 'POST',
        payload: payload,
        pathToRevalidate: ['/dashboard/settings/security'],
    });
}

export async function generateTwoFactorSecret(): Promise<ApiResponse<TwoFactorAuthResponseInterface>> {
    return await makeApiRequest<TwoFactorAuthResponseInterface>({
        endpoint: '/resource/otp/generate_qrcode',
        apiVersion: 'barong',
        method: 'POST',
    });
} 

export async function generateApiKey(payload: ApiKeyFormInterface): Promise<ApiResponse<ApiKeyResponseInterface>> {
    return await makeApiRequest<ApiKeyResponseInterface>({
        endpoint: '/resource/api_keys',
        apiVersion: 'barong',
        method: 'POST',
        payload: {
            totp_code: payload.totp_code,
            algorithm: payload.algorithm,
        },
        pathToRevalidate: ['/dashboard/settings/api'],
    });
}

export async function getApiKeyList(): Promise<ApiResponse<ApiKeyResponseInterface[]>> {
    return await makeApiRequest<ApiKeyResponseInterface[]>({
        endpoint: '/resource/api_keys',
        apiVersion: 'barong',
    });
}

export async function deleteApiKey(payload: ApiKeyFormInterface): Promise<ApiResponse> {
    return await makeApiRequest({
        endpoint: `/resource/api_keys/${payload.kid}?totp_code=${payload.totp_code}`,
        apiVersion: 'barong',
        method: 'DELETE',
        pathToRevalidate: ['/dashboard/settings/api'],
    });
}

export async function updateApiKey(payload: ApiKeyFormInterface): Promise<ApiResponse> {
    console.log(payload);

    return await makeApiRequest({
        endpoint: `/resource/api_keys/${payload.kid}`,
        apiVersion: 'barong',
        method: 'PATCH',
        payload: {
            totp_code: payload.totp_code,
            state: payload.state,
        },
        pathToRevalidate: ['/dashboard/settings/api'],
    });
}
