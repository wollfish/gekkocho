'use server';

import { ApiResponse, makeApiRequest } from '@/lib/api';
import {
    AccountResponseInterface,
    BeneficiaryActivationFormInterface,
    BeneficiaryFormCryptoInterface,
    BeneficiaryFormFiatInterface,
    BeneficiaryInterface,
    CurrencyResponseInterface,
    WithdrawalFormInterface,
    withdrawalFormSchema,
    WithdrawalInterface,
} from '@/lib/zod';

export async function getAccountList(): Promise<ApiResponse<AccountResponseInterface[]>> {
    const { success, data, error } = await makeApiRequest<AccountResponseInterface[]>({
        endpoint: '/account/balances',
        apiVersion: 'peatio',
    });

    const filteredData = data?.filter((w) => w.wallet_type === 'spot');

    return { success, data: filteredData, error };
}

export async function getWithdrawalList(payload?: { type: string }): Promise<ApiResponse<WithdrawalInterface[]>> {
    return await makeApiRequest<WithdrawalInterface[]>({
        endpoint: '/account/withdraws',
        apiVersion: 'peatio',
        payload,
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

export async function addNewCryptoBeneficiary(formData: BeneficiaryFormCryptoInterface): Promise<ApiResponse<BeneficiaryInterface[]>> {
    const payload = {
        ...formData,

        // TODO: remove after migration
        data: JSON.stringify({ address: formData.address }),
        blockchain_key: formData.network,
    };

    return await makeApiRequest<BeneficiaryInterface[]>({
        endpoint: '/account/beneficiaries',
        apiVersion: 'peatio',
        method: 'POST',
        payload: payload,
        pathToRevalidate: ['/dashboard/beneficiaries/fiat', '/dashboard/beneficiaries/coin'],
    });
}

export async function addNewFiatBeneficiary(formData: BeneficiaryFormFiatInterface): Promise<ApiResponse<BeneficiaryInterface[]>> {
    const payload = {
        currency: formData.currency,
        name: formData.nick_name,
        blockchain_key: formData.blockchain_key,
        data: JSON.stringify({
            nick_name: formData.nick_name.trim(),
            full_name: formData.full_name.trim().slice(0, 35),
            account_type: formData.account_type.trim(),
            account_number: formData.account_number.trim(),
            bank_ifsc_code: formData.bank_ifsc_code.toUpperCase().trim(),
        }),
    };

    return await makeApiRequest<BeneficiaryInterface[]>({
        endpoint: '/account/beneficiaries',
        apiVersion: 'peatio',
        method: 'POST',
        payload: payload,
        pathToRevalidate: ['/dashboard/beneficiaries/fiat', '/dashboard/beneficiaries/crypto'],
    });
}

export async function activateBeneficiary(formData: BeneficiaryActivationFormInterface): Promise<ApiResponse<BeneficiaryInterface[]>> {
    return await makeApiRequest<BeneficiaryInterface[]>({
        endpoint: `/account/beneficiaries/${formData.id}/activate`,
        apiVersion: 'peatio',
        method: 'PATCH',
        payload: formData,
        pathToRevalidate: ['/dashboard/beneficiaries/fiat', '/dashboard/beneficiaries/crypto'],
    });
}

export async function resendBeneficiaryActivation({ id }: { id: string }): Promise<ApiResponse> {
    return await makeApiRequest({
        endpoint: `/account/beneficiaries/${id}/resend_pin`,
        apiVersion: 'peatio',
        method: 'PATCH',
        pathToRevalidate: ['/dashboard/beneficiaries/fiat', '/dashboard/beneficiaries/crypto'],
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
        pathToRevalidate: ['/dashboard/withdrawals/crypto', '/dashboard/withdrawals/fiat'],
    });
}
