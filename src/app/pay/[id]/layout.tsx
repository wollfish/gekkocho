import React, { ReactNode } from 'react';
import { Metadata } from 'next';
import NextLink from 'next/link';

import { Icons, Logo } from '@/components/icons';
import { description, linkStyles } from '@/components/primitives';
import { ThemeSwitch } from '@/components/theme-switch';

export const metadata: Metadata = {
    title: 'Payment',
};
export default function Layout({ children }: { children: ReactNode }) {
    return (
        <section className="flex size-full flex-col">
            <header className="flex justify-end">
                <ThemeSwitch/>
            </header>
            <div className="m-auto">
                {children}
                <div className="mt-4 flex flex-col items-center text-sm">
                    <NextLink className={linkStyles().base({ type: 'underline', color: 'default', className: 'px-1' })} href="/aml-policy">
                        AML Policy
                    </NextLink>
                    <p className={description({ size: 'xs', className: 'text-center' })}>
                        Contact us if you have any questions
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
