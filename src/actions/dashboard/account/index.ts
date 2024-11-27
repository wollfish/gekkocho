'use server';

import { ApiResponse, makeApiRequest } from '@/lib/api';
import {
    AccountResponseInterface,
    BeneficiaryActivationFormInterface,
    BeneficiaryFormInterface,
    beneficiaryFormSchema,
    BeneficiaryInterface,
    CurrencyResponseInterface,
    WithdrawalFormInterface,
    withdrawalFormSchema,
} from '@/lib/zod';

export async function getAccountList(): Promise<ApiResponse<AccountResponseInterface[]>> {
    return await makeApiRequest<AccountResponseInterface[]>({
        endpoint: '/account/balances',
        apiVersion: 'peatio',
    });
}

export async function getWithdrawalList(): Promise<ApiResponse<AccountResponseInterface[]>> {
    return await makeApiRequest<AccountResponseInterface[]>({
        endpoint: '/account/withdraws',
        apiVersion: 'peatio',
    });
}

export async function getBeneficiaryList(): Promise<ApiResponse<AccountResponseInterface[]>> {
    return await makeApiRequest<AccountResponseInterface[]>({
        endpoint: '/account/beneficiaries',
        apiVersion: 'peatio',
    });
}

export async function getCurrencyList(): Promise<ApiResponse<CurrencyResponseInterface[]>> {
    return await makeApiRequest<CurrencyResponseInterface[]>({
        endpoint: '/public/currencies',
        apiVersion: 'peatio',
        noCache: false,
    });
}

export async function addNewBeneficiary(formData: BeneficiaryFormInterface): Promise<ApiResponse<BeneficiaryInterface[]>> {
    const validatedFormData = beneficiaryFormSchema.safeParse(formData);

    if (!validatedFormData.success) {
        return {
            success: false,
            error: validatedFormData.error.message,
            data: null,
        };
    }

    const payload = {
        name: formData.name,
        currency: formData.currency,
        description: formData.description,

        address: formData.address,
        network: formData.network,

        // TODO: remove after migration
        data: JSON.stringify({ address: formData.address }),
        blockchain_key: formData.network,
    };

    return await makeApiRequest<BeneficiaryInterface[]>({
        endpoint: '/account/beneficiaries',
        apiVersion: 'peatio',
        method: 'POST',
        payload: payload,
        pathToRevalidate: '/dashboard/account/beneficiaries',
    });
}

export async function activateBeneficiary(formData: BeneficiaryActivationFormInterface): Promise<ApiResponse<BeneficiaryInterface[]>> {
    return await makeApiRequest<BeneficiaryInterface[]>({
        endpoint: `/account/beneficiaries/${formData.id}/activate`,
        apiVersion: 'peatio',
        method: 'PATCH',
        payload: formData,
        pathToRevalidate: '/dashboard/account/beneficiaries',
    });
}

export async function deleteBeneficiary(id: string): Promise<ApiResponse<BeneficiaryInterface[]>> {
    return await makeApiRequest<BeneficiaryInterface[]>({
        endpoint: `/account/beneficiaries/${id}`,
        apiVersion: 'peatio',
        method: 'DELETE',
    });
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
