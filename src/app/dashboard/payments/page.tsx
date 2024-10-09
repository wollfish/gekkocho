import React from 'react';

import { PaymentFormWrapper } from '@/app/dashboard/payments/utils';
import { title } from '@/components/primitives';

export default async function PaymentsPage() {
    return (
        <section className="flex size-full flex-col">
            <h2 className={title({ fullWidth: true })}>Payments</h2>
            <PaymentFormWrapper/>
        </section>
    );
}
