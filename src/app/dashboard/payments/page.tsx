import React from 'react';
import NextLink from 'next/link';

import { Icons } from '@/components/icons';
import { link, title } from '@/components/primitives';

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
            <NextLink className={link().base({ type: 'solid', className: 'm-auto' })} href={randomLink}>
                <span>Create New Payment</span>
                <Icons.arrowRight className={link().icon()}/>
            </NextLink>
        </section>
    );
}
