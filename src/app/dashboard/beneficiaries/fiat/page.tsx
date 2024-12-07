import React from 'react';

import { getBeneficiaryList, getCurrencyList } from '@/actions/dashboard/account';
import { BeneficiaryFiatList } from '@/app/dashboard/account/utils/BeneficiaryFiatList';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';

export const dynamic = 'force-dynamic';

export default async function Page() {
    let { data: beneficiaries, error: beneficiaryError } = await getBeneficiaryList();
    let { data: currencies, error: currencyError } = await getCurrencyList() ;
    
    beneficiaries ||= [];
    currencies ||= [];

    const fiatCurrencies = currencies.filter((currency) => currency.type === 'fiat');
    const fiatCurrenciesIds = fiatCurrencies.map((currency) => currency.id);
    const fiatBeneficiaries = beneficiaries.filter((beneficiary) => fiatCurrenciesIds.includes(beneficiary.currency));
    const data = fiatBeneficiaries.map((beneficiary) => ({
        ...beneficiary,
        ...beneficiary.data,
    }));

    return (
        <DataPageTemplate error={beneficiaryError || currencyError}>
            <section className="flex grow flex-col overflow-auto py-4">
                <BeneficiaryFiatList beneficiaries={data} currencies={fiatCurrencies} type="fiat"/>
            </section>
        </DataPageTemplate>
    );
}
