import React from 'react';

import { getBeneficiaryList, getCurrencyList } from '@/actions/dashboard/account';
import { BeneficiaryCryptoList } from '@/app/dashboard/account/utils/BeneficiaryCryptoList';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';

export const dynamic = 'force-dynamic';

export default async function Page() {
    let { data: beneficiaries, error: beneficiaryError } = await getBeneficiaryList();
    let { data: currencies, error: currencyError } = await getCurrencyList();

    beneficiaries ||= [];
    currencies ||= [];

    const coinCurrencies = currencies.filter((currency) => currency.type === 'coin');
    const coinCurrenciesIds = coinCurrencies.map((currency) => currency.id);
    const coinBeneficiaries = beneficiaries.filter((beneficiary) => coinCurrenciesIds.includes(beneficiary.currency));

    return (
        <DataPageTemplate error={beneficiaryError || currencyError}>
            <section className="flex grow flex-col overflow-auto py-4">
                <BeneficiaryCryptoList beneficiaries={coinBeneficiaries} currencies={coinCurrencies} type="coin"/>
            </section>
        </DataPageTemplate>
    );
}
