import React from 'react';

import { PaymentFormWrapper } from '@/app/dashboard/payments/utils';
import { title } from '@/components/primitives';

export default function PaymentsPage() {
    //generate random uuid
    function generateRandomEthAddress(): string {
        const chars = '0123456789abcdef';
        let address = '0x';

        // Generate a random 40-character hexadecimal string
        for (let i = 0; i < 40; i++) {
            address += chars[Math.floor(Math.random() * chars.length)];
        }

        return address;
    }

    const randomLink = '/pay/' + generateRandomEthAddress();

    return (
        <section className="flex size-full flex-col">
            <h2 className={title({ fullWidth: true })}>Payments</h2>
            <PaymentFormWrapper/>
        </section>
    );
}
