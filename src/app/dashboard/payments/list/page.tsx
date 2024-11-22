import React from 'react';

import { getPaymentList } from '@/actions/dashboard/payment';
import { PaymentList } from '@/app/dashboard/payments/utils';

export default async function PaymentsPage() {
    const { data } = await getPaymentList();

    return (
        <section className="flex grow flex-col overflow-auto py-4">
            <PaymentList data={data}/>
        </section>
    );
}
