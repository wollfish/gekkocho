import React from 'react';

import { SessionProvider } from 'next-auth/react';

import { DashboardSideNav, DashboardTopNav } from '@/components/dashboard';
import { BackgroundGradient } from '@/components/ui/BackgroundGradient';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <section className="flex h-screen overflow-hidden">
                <DashboardSideNav/>
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <DashboardTopNav/>
                    <main className="z-10 size-full p-4">
                        {children}
                    </main>
                    <BackgroundGradient/>
                </div>
            </section>
        </SessionProvider>
    );
}
