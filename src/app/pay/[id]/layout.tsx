import React, { ReactNode, Suspense } from 'react';
import { Metadata } from 'next';
import NextLink from 'next/link';

import { Icons, Logo } from '@/components/icons';
import { description } from '@/components/primitives';
import { ThemeSwitch } from '@/components/theme-switch';

export const metadata: Metadata = {
    title: 'Pay',
};
export default function Layout({ children }: { children: ReactNode }) {
    return (
        <section className="flex size-full flex-col">
            <header className="flex justify-end">
                <ThemeSwitch/>
            </header>
            <div className="m-auto">
                <Suspense fallback="loading...">
                    {children}
                </Suspense>
                <div className="mt-4 flex flex-col items-center">
                    <p className={description({ size: 'xs', className: 'text-center' })}>
                        Please contact us if you have any questions
                    </p>
                    <div className="flex gap-2"><Icons.send/><Icons.headphone/></div>
                </div>
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
