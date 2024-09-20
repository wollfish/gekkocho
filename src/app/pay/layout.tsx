import React from 'react';

import { BackgroundGradient } from '@/components/ui/BackgroundGradient';

export default function PayLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="flex h-screen overflow-hidden">
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                <main className="z-10 size-full p-4">
                    {children}
                </main>
                <BackgroundGradient/>
            </div>
        </section>
    );
}
