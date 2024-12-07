import React from 'react';

import { getPaymentList } from '@/actions/dashboard/payment';
import { PaymentLinkList } from '@/app/dashboard/payments/utils';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';

export const dynamic = 'force-dynamic';

export default async function PaymentsPage() {
    let { data: paymentList, error: paymentListError } = await getPaymentList();

    paymentList ||= [];

    return (
        <DataPageTemplate error={paymentListError}>
            <section className="flex grow flex-col overflow-auto py-4">
                <PaymentLinkList data={paymentList}/>
            </section>
        </DataPageTemplate>
    );
}
