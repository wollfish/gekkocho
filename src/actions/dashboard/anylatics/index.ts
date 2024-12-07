'use server';

import { ApiResponse, makeApiRequest } from '@/lib/api';

export async function fetchAnalytics(): Promise<ApiResponse> {
    return await makeApiRequest({
        endpoint: '/account/payments',
        apiVersion: 'peatio',
        method: 'GET',
    });
}
