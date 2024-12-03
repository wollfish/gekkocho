import React from 'react';

import { getBeneficiaryList, getCurrencyList } from '@/actions/dashboard/account';
import { BeneficiaryList } from '@/app/dashboard/account/utils/BeneficiaryList';
import { fetchData } from '@/lib/api';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';

export const dynamic = 'force-dynamic';

export default async function Page() {
    const { loading, data: beneficiaries, error: beneficiaryError } = await fetchData(getBeneficiaryList);
    const { data: currencies, error: currencyError } = await fetchData(getCurrencyList);

    return (
        <DataPageTemplate data={beneficiaries} error={beneficiaryError || currencyError} loading={loading}>
            <section className="flex grow flex-col overflow-auto py-4">
                <BeneficiaryList beneficiaries={beneficiaries} currencies={currencies}/>
            </section>
        </DataPageTemplate>
    );
}
