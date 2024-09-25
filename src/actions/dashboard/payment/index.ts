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

        //generate query string filter out empty values
        const queryString = Object.keys(parsedFormData.data)
            .filter((key) => parsedFormData.data[key] !== null && parsedFormData.data[key] !== '')
            .map((key) => `${key}=${parsedFormData.data[key]}`)
            .join('&');

        const paymentId = generateRandomUUID();

        const data = {
            ...parsedFormData.data,
            payment_id: paymentId,
            query_string: queryString,
        };

        return { success: true, error: null, data };

    } catch (e) {
        if (isRedirectError(e)) throw e;
        throw e;
    }
}
