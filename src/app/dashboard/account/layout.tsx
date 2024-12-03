import React, { Suspense } from 'react';

import { Metadata } from 'next';

import { DashboardTabs } from '@/app/dashboard/utils/DashboardTabs';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
    title: 'Settings',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <section aria-label="Payment Layout" className="flex size-full flex-col pr-16">
            <DashboardTabs tabs={siteConfig.dashboardAccountNavItems}/>
            <Suspense>
                {children}
            </Suspense>
        </section>
    );
}
