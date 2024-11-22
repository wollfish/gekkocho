'use server';

import { isRedirectError } from 'next/dist/client/components/redirect';

import { PaymentFormInterface, paymentFormSchema } from '@/lib/zod';

// create random UUID
function generateRandomUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);

        return v.toString(16);
    });
}

export async function initializePayment(formData: PaymentFormInterface) {
    try {
        const validatedFormData = paymentFormSchema.safeParse(formData);

        if (!validatedFormData.success) {
            return {
                success: false,
                error: {
                    message: validatedFormData.error.message,
                    details: JSON.stringify(validatedFormData.error.errors),
                },
            };
        }

        const paymentId = generateRandomUUID();

        const data = {
            ...validatedFormData.data,
            payment_link: `/pay/${paymentId}`,
        };

        return { success: true, error: null, data };

    } catch (e) {
        if (isRedirectError(e)) throw e;
        throw e;
    }
}

export async function getPaymentList() {
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/payment/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        const res = await data.json();

        if (!data.ok) {
            console.warn('getPaymentList - data', res);

            return { success: false, error: res?.error, data: null };
        }

        return { success: true, error: null, data: res };

    } catch (e) {
        console.error('getPaymentList - error', e);
        throw e;
    }
}
