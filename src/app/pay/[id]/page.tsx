import React, { Suspense } from 'react';

import NextLink from 'next/link';

import { WidgetContainer } from '@/app/pay/utils';
import { Logo } from '@/components/icons';
import { ThemeSwitch } from '@/components/theme-switch';

export default function Page({ params }: { params: { id: string } }) {
    return (
        <section className="flex size-full flex-col">
            <header className="flex justify-end">
                <ThemeSwitch/>
            </header>
            <div className="m-auto">
                <Suspense>
                    <WidgetContainer id={params.id}/>
                </Suspense>
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
