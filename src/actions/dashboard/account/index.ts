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
    withdrawalFormSchema, WithdrawalInterface,
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

type GetBeneficiaryListParams = {
    currency_id: string;
    blockchain_key: string;
};
export async function getBeneficiaryList(payload?: GetBeneficiaryListParams): Promise<ApiResponse<BeneficiaryInterface[]>> {
    return await makeApiRequest<BeneficiaryInterface[]>({
        endpoint: '/account/beneficiaries',
        apiVersion: 'peatio',
        payload,
    });
}

export async function getCurrencyList(): Promise<ApiResponse<CurrencyResponseInterface[]>> {
    return await makeApiRequest<CurrencyResponseInterface[]>({
        endpoint: '/public/currencies',
        apiVersion: 'peatio',
        cache: true,
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
        pathToRevalidate: ['/dashboard/account/beneficiaries'],
    });
}

export async function activateBeneficiary(formData: BeneficiaryActivationFormInterface): Promise<ApiResponse<BeneficiaryInterface[]>> {
    return await makeApiRequest<BeneficiaryInterface[]>({
        endpoint: `/account/beneficiaries/${formData.id}/activate`,
        apiVersion: 'peatio',
        method: 'PATCH',
        payload: formData,
        pathToRevalidate: ['/dashboard/account/beneficiaries'],
    });
}

export async function deleteBeneficiary(id: string): Promise<ApiResponse<BeneficiaryInterface[]>> {
    return await makeApiRequest<BeneficiaryInterface[]>({
        endpoint: `/account/beneficiaries/${id}`,
        apiVersion: 'peatio',
        method: 'DELETE',
    });
}

export async function doWithdrawal(formData: WithdrawalFormInterface): Promise<ApiResponse<WithdrawalInterface>> {
    const validatedFormData = withdrawalFormSchema.safeParse(formData);

    if (!validatedFormData.success) {
        return {
            success: false,
            error: validatedFormData.error.message,
            data: null,
        };
    }

    const payload = {
        currency: validatedFormData.data.currency,
        amount: validatedFormData.data.amount,
        otp: validatedFormData.data.otp,
        beneficiary_id: validatedFormData.data.beneficiary_id,
        note: validatedFormData.data.remarks,
    };

    return await makeApiRequest<WithdrawalInterface>({
        endpoint: '/account/withdraws',
        apiVersion: 'peatio',
        method: 'POST',
        payload: payload,
        pathToRevalidate: ['/dashboard/account', '/dashboard/account/withdrawals'],
    });
}
