import React from 'react';

import { DashboardSideNav, DashboardTopNav } from '@/components/dashboard';
import { BackgroundGradient } from '@/components/ui/BackgroundGradient';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
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
    );
}
