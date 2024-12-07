import React, { ReactNode } from 'react';
import { Metadata } from 'next';
import NextLink from 'next/link';

import { Logo } from '@/components/icons';
import { ThemeSwitch } from '@/components/theme-switch';

export const metadata: Metadata = {
    title: 'Payment',
};
export default function Layout({ children }: { children: ReactNode }) {
    return (
        <section className="flex size-full flex-col">
            <header className="flex min-h-12 justify-end px-4">
                <ThemeSwitch/>
            </header>
            {children}
            <footer className="flex min-h-12 justify-center">
                <NextLink className="flex items-center justify-start gap-1" href="/">
                    <Logo/>
                    <span className="font-bold text-inherit">Powered by CoinDhan Pay</span>
                </NextLink>
            </footer>
        </section>
    );
}
