'use server';

import { revalidatePath } from 'next/cache';

import { PaymentMethodFormInterface, PaymentResponseInterface } from '@/lib/zod';

export const getPaymentInfo = async (payload: { payment_id: string }): Promise<{
    success: boolean;
    error: string | null;
    data: PaymentResponseInterface
}> => {
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/payment/info?payment_id=${payload.payment_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            cache: 'no-cache',
        });

        const res = await data.json();

        if (!data.ok) {
            console.warn('getPaymentInfo - data', res);

            return { success: false, error: res?.error || 'UUID not found', data: null };
        }

        return { success: true, error: null, data: res };
    } catch (e) {
        console.error('getPaymentInfo - error', e);
        throw e;
    }
};

export const getPaymentMethods = async (payload: { payment_id: string }) => {
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/payment/currencies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            cache: 'no-cache',
        });

        const res = await data.json();

        if (!data.ok) {
            console.warn('getPaymentMethods - data', res);

            return { success: false, error: res?.error, data: null };
        }

        return { success: true, error: null, data: res };
    } catch (e) {
        console.error('getPaymentMethods - error', e);
        throw e;
    }
};

export const setPaymentMethod = async (payload: PaymentMethodFormInterface) => {
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/payment/methods`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            cache: 'no-cache',
        });

        const res = await data.json();

        if (!data.ok) {
            console.warn('setPaymentMethod - data', res);

            return { success: false, error: res?.error, data: null };
        }

        revalidatePath('/pay/[id]', 'page');

        return { success: true, error: null, data: res };
    } catch (e) {
        console.error('setPaymentMethod - error', e);
        throw e;
    }
};
