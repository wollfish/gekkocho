'use server';

import {
    BeneficiaryFormInterface,
    beneficiaryFormSchema,
    WithdrawalFormInterface,
    withdrawalFormSchema,
} from '@/lib/zod';

export async function getWalletList() {
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/wallet/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        const res = await data.json();

        if (!data.ok) {
            console.warn('getWalletList - data', res);

            return { success: false, error: res?.error, data: null };
        }

        return { success: true, error: null, data: res };

    } catch (e) {
        console.error('getWalletList - error', e);
        throw e;
    }
}

export async function getWithdrawalList() {
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/withdraw/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        const res = await data.json();

        if (!data.ok) {
            console.warn('getWithdrawalList - data', res);

            return { success: false, error: res?.error, data: null };
        }

        return { success: true, error: null, data: res };

    } catch (e) {
        console.error('getWithdrawalList - error', e);
        throw e;
    }
}

export async function addNewBeneficiary(formData: BeneficiaryFormInterface) {
    try {
        const validatedFormData = beneficiaryFormSchema.safeParse(formData);

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
            console.warn('getBeneficiaryList - data', res);

            return { success: false, error: res?.error, data: null };
        }

        return { success: true, error: null, data: res };

    } catch (e) {
        console.error('getBeneficiary - error', e);
        throw e;
    }
}

export async function createWithdrawal(formData: WithdrawalFormInterface) {
    try {
        const validatedFormData = withdrawalFormSchema.safeParse(formData);

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
            console.warn('createWithdrawal - data', res);

            return { success: false, error: res?.error, data: null };
        }

        return { success: true, error: null, data: res };

    } catch (e) {
        console.error('createWithdrawal - error', e);
        throw e;
    }
}
