'use server';

import { getCurrencyList } from '@/actions/dashboard/account';
import { ApiResponse, makeApiRequest } from '@/lib/api';
import {
    PaymentFormInterface,
    paymentFormSchema,
    PaymentMethodFormInterface,
    PaymentMethodInterface,
    PaymentResponseInterface,
} from '@/lib/zod';

export async function initializePayment(formData: PaymentFormInterface): Promise<ApiResponse<PaymentResponseInterface>> {
    const validatedFormData = paymentFormSchema.safeParse(formData);

    if (!validatedFormData.success) {
        return {
            success: false,
            error: validatedFormData.error.message,
            data: null,
        };
    }

    const payload = {
        ...validatedFormData.data,
        description: validatedFormData.data.product_name,
        customer: JSON.stringify({
            name: validatedFormData.data.customer_name,
            email: validatedFormData.data.customer_email,
        }),
    };

    return await makeApiRequest<PaymentResponseInterface>({
        endpoint: '/account/payment_requests',
        apiVersion: 'peatio',
        method: 'POST',
        payload: payload,
        pathToRevalidate: ['/dashboard/payments/list'],
    });
}

export async function getPaymentList(): Promise<ApiResponse<PaymentResponseInterface[]>> {
    return await makeApiRequest<PaymentResponseInterface[]>({
        endpoint: '/account/payment_requests',
        apiVersion: 'peatio',
    });
}

export async function getPaymentInfoPrivate(payload: { id: string }): Promise<ApiResponse<PaymentResponseInterface>> {
    const response = await makeApiRequest<PaymentResponseInterface[]>({
        endpoint: '/account/payment_requests',
        apiVersion: 'peatio',
        payload: { id: payload.id },
    });

    return {
        ...response,
        data: response?.data?.[0] || null,
    };
}

export async function getPaymentInfoPublic(payload: { id: string }): Promise<ApiResponse<PaymentResponseInterface>> {
    return await makeApiRequest<PaymentResponseInterface>({
        endpoint: `/public/payment_requests/${payload.id}`,
        apiVersion: 'peatio',
        cache: false,
        method: 'GET',
        isPublic: true,
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

export async function setPaymentMethod(payload: PaymentMethodFormInterface): Promise<ApiResponse<PaymentResponseInterface>> {
    const payload_data = {
        ...payload,
        customer: JSON.stringify({
            name: payload.customer_name,
            email: payload.customer_email,
        }),
    };

    return await makeApiRequest<PaymentResponseInterface>({
        endpoint: `/public/payment_requests/${payload.payment_id}`,
        apiVersion: 'peatio',
        isPublic: true,
        method: 'PUT',
        payload: payload_data,
        pathToRevalidate: ['/pay/[id]'],
    });
}
