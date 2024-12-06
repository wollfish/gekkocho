import React from 'react';

import { getPaymentList } from '@/actions/dashboard/payment';
import { PaymentList } from '@/app/dashboard/payments/utils';
import { fetchData } from '@/lib/api';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';

export const dynamic = 'force-dynamic';

export default async function PaymentsPage() {
    const { loading, data: payments = [], error } = await fetchData(getPaymentList);

    return (
        <DataPageTemplate error={error} loading={loading}>
            <section className="flex grow flex-col overflow-auto py-4">
                <PaymentList data={payments}/>
            </section>
        </DataPageTemplate>
    );
}
