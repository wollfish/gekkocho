'use server';

import { ApiResponse, makeApiRequest } from '@/lib/api';
import { PaymentFormInterface, paymentFormSchema, PaymentResponseInterface } from '@/lib/zod';

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
