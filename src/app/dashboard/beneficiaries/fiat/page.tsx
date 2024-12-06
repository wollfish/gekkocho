import React from 'react';

import { getBeneficiaryList, getCurrencyList } from '@/actions/dashboard/account';
import { BeneficiaryFiatList } from '@/app/dashboard/account/utils/BeneficiaryFiatList';
import { fetchData } from '@/lib/api';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';

export const dynamic = 'force-dynamic';

export default async function Page() {
    const { loading, data: beneficiaries, error: beneficiaryError } = await fetchData(getBeneficiaryList);
    const { data: currencies, error: currencyError } = await fetchData(getCurrencyList);

    const fiatCurrencies = currencies.filter((currency) => currency.type === 'fiat');
    const fiatCurrenciesIds = fiatCurrencies.map((currency) => currency.id);
    const fiatBeneficiaries = beneficiaries.filter((beneficiary) => fiatCurrenciesIds.includes(beneficiary.currency));
    const data = fiatBeneficiaries.map((beneficiary) => ({
        ...beneficiary,
        ...beneficiary.data,
    }));

    return (
        <DataPageTemplate error={beneficiaryError || currencyError} loading={loading}>
            <section className="flex grow flex-col overflow-auto py-4">
                <BeneficiaryFiatList beneficiaries={data} currencies={fiatCurrencies} type="fiat"/>
            </section>
        </DataPageTemplate>
    );
}
