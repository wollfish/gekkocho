'use server';

import { getCurrencyList } from '@/actions/dashboard/account';
import { ApiResponse, makeApiRequest } from '@/lib/api';
import { PaymentMethodFormInterface, PaymentMethodInterface, PaymentResponseInterface } from '@/lib/zod';

export async function getPaymentInfo(payload: { payment_id: string }): Promise<ApiResponse<PaymentResponseInterface>> {
    return await makeApiRequest<PaymentResponseInterface>({
        endpoint: `/public/payment_requests/${payload.payment_id}`,
        apiVersion: 'peatio',
        cache: false,
    });
}

export async function getPaymentMethods(): Promise<ApiResponse<PaymentMethodInterface[]>> {
    const { success, error, data } = await getCurrencyList();

    const res_data = data?.map((c) => ({
        id: c.id,
        currency_name: c.name,
        networks: c.networks,
        status: c.status,
        exchange_rate: c.price,
        currency_icon: c.icon_url,
        currency_type: c.type,
    }));

    return { success, error, data: res_data };
}

export async function setPaymentMethod(payload: PaymentMethodFormInterface) : Promise<ApiResponse<PaymentResponseInterface>> {
    return await makeApiRequest<PaymentResponseInterface>({
        endpoint: `/public/payment_requests/${payload.payment_id}`,
        apiVersion: 'peatio',
        method: 'PUT',
        payload,
        pathToRevalidate: ['/pay/[id]'],
    });
}
