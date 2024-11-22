'use server';

import { contactUsSchema, ContactUsSchema } from '@/lib/zod';

export async function doContactUs(formData: ContactUsSchema) {
    try {
        const validatedFormData = contactUsSchema.safeParse(formData);

        if (!validatedFormData.success) {
            return {
                success: false,
                error: {
                    message: validatedFormData.error.message,
                    details: JSON.stringify(validatedFormData.error.errors),
                },
            };
        }

        const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/beneficiary/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            cache: 'no-store',
        });

        const res = await data.json();

        if (!data.ok) {
            console.warn('doContactUs - data', res);

            return { success: false, error: res?.error, data: null };
        }

        return { success: true, error: null, data: res };

    } catch (e) {
        console.error('doContactUs - error', e);
        throw e;
    }
}
