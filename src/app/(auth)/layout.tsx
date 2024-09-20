import React from 'react';

import NextLink from 'next/link';

import { Logo } from '@/components/icons';
import { ThemeSwitch } from '@/components/theme-switch';
import { BackgroundGradient } from '@/components/ui/BackgroundGradient';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="flex h-screen overflow-hidden">
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                <div className="z-10 flex items-center justify-between p-4">
                    <NextLink className="-ml-1 flex items-center gap-1" href="/">
                        <Logo size={32}/>
                        <span className="font-bold">CoinDhan Pay</span>
                    </NextLink>
                    <ThemeSwitch/>
                </div>
                <main className="z-10 flex size-full p-4">
                    {children}
                </main>
                <BackgroundGradient/>
            </div>
        </section>
    );
}
