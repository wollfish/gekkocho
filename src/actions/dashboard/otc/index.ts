'use server';

import { ApiResponse, makeApiRequest } from '@/lib/api';
import { OtcOrderFormInterface, OtcOrderInterface, OtcQuoteFormInterface, OtcQuoteInterface } from '@/lib/zod';

export async function getOtcConversionRate(payload: OtcQuoteFormInterface): Promise<ApiResponse<OtcQuoteInterface>> {
    return await makeApiRequest({
        endpoint: '/market/otc_quotes/new',
        apiVersion: 'peatio',
        method: 'POST',
        payload,
        pathToRevalidate: ['/dashboard/otc/quote'],
    });
}

export async function getOtcQuoteById(payload: { quote_id: string }): Promise<ApiResponse<OtcQuoteInterface>> {
    const response = await makeApiRequest<OtcQuoteInterface>({
        endpoint: '/market/otc_quotes/status',
        apiVersion: 'peatio',
        method: 'GET',
        payload,
    });

    return { ...response, data: response?.data?.[0] || null };
}

export async function getOtcQuoteList(): Promise<ApiResponse<OtcQuoteInterface[]>> {
    return await makeApiRequest<OtcQuoteInterface[]>({
        endpoint: '/market/otc_quotes/status',
        apiVersion: 'peatio',
        method: 'GET',
    });
}

export async function createOtcOrderWithQuoteId(payload: { quote_id: string }): Promise<ApiResponse<OtcOrderInterface>> {
    return await makeApiRequest({
        endpoint: `/market/otc_quotes/place_order/${payload.quote_id}`,
        apiVersion: 'peatio',
        method: 'PATCH',
        payload,
    });
}

export async function createOtcOrder(payload: OtcOrderFormInterface): Promise<ApiResponse<OtcOrderInterface>> {
    return await makeApiRequest({
        endpoint: '/market/otc_orders',
        apiVersion: 'peatio',
        method: 'POST',
        payload,
    });
}

export async function getOtcOrderList(): Promise<ApiResponse<OtcOrderInterface[]>> {
    return await makeApiRequest<OtcOrderInterface[]>({
        endpoint: '/market/otc_orders',
        apiVersion: 'peatio',
        method: 'GET',
    });
}
