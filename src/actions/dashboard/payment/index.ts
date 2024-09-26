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
        const parsedFormData = paymentFormSchema.safeParse(formData);

        if (!parsedFormData.success) {
            return {
                success: false,
                error: { message: parsedFormData.error.message, details: JSON.stringify(parsedFormData.error.errors) },
            };
        }

        const paymentId = generateRandomUUID();

        const data = {
            ...parsedFormData.data,
            payment_link: `/pay/${paymentId}`,
        };

        return { success: true, error: null, data };

    } catch (e) {
        if (isRedirectError(e)) throw e;
        throw e;
    }
}
