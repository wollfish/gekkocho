import React from 'react';

import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';

import { DashboardSideNav, DashboardTopNav } from '@/app/dashboard/utils';
import { BackgroundGradient } from '@/components/ui/BackgroundGradient';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
    title: {
        default: 'Dashboard',
        template: `%s | Dashboard - ${siteConfig.name}`,
    },
};
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <section className="flex h-screen overflow-hidden">
                <DashboardSideNav/>
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <DashboardTopNav/>
                    <main className="z-10 flex-1 overflow-hidden p-4">
                        {children}
                    </main>
                    <BackgroundGradient/>
                </div>
            </section>
        </SessionProvider>
    );
}
