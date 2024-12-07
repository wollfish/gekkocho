import React, { Suspense } from 'react';

import { Metadata } from 'next';

import { DashboardTabs } from '@/app/dashboard/utils/DashboardTabs';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
    title: 'Beneficiaries',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section aria-label="Beneficiary Layout" className="flex size-full flex-col pr-16">
            <DashboardTabs tabs={siteConfig.dashboardWithdrawalsNavItems}/>
            <Suspense>
                {children}
            </Suspense>
        </section>
    );
}
