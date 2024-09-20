import React from 'react';

import NextLink from 'next/link';

import { Logo } from '@/components/icons';
import { PayWidget } from '@/components/paymentPage/payWidget';
import { ThemeSwitch } from '@/components/theme-switch';

export default function Page({ params }: { params: { id: string } }) {
    return (
        <section className="flex size-full flex-col">
            <header className="flex justify-end">
                <ThemeSwitch/>
            </header>
            <div className="m-auto">
                <PayWidget qrCode={params.id}/>
            </div>
            <footer className="flex justify-center">
                <NextLink className="flex items-center justify-start gap-1" href="/">
                    <Logo/>
                    <span className="font-bold text-inherit">Powered by CoinDhan Pay</span>
                </NextLink>
            </footer>
        </section>
    );
}
