'use server';

import { ApiResponse, makeApiRequest } from '@/lib/api';
import {
    ApiKeyFormInterface,
    ApiKeyResponseInterface,
    TwoFactorAuthFormInterface,
    TwoFactorAuthResponseInterface,
    UserInterface,
} from '@/lib/zod';

export async function getProfile(): Promise<ApiResponse<UserInterface>> {
    return await makeApiRequest<UserInterface>({
        endpoint: '/resource/users/me',
        apiVersion: 'barong',
        cache: true,
    });
}

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
