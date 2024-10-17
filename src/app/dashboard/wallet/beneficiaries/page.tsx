import React from 'react';

import { getPaymentList } from '@/actions/dashboard/payment';
import { BeneficiaryList } from '@/app/dashboard/wallet/utils/BeneficiaryList';

export default async function Page() {
    const { data } = await getPaymentList();

    return (
        <section className="flex grow flex-col overflow-auto py-4">
            <BeneficiaryList data={data}/>
        </section>
    );
}
