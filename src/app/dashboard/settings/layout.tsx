import React, { Suspense } from 'react';

import { Metadata } from 'next';

import { SettingsTabs } from '@/app/dashboard/settings/utils';
import { Breadcrumbs } from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
    title: 'Settings',
};
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <section aria-label="Settings Layout" className="flex size-full flex-col pr-16">
            <Breadcrumbs/>
            <SettingsTabs/>
            <Suspense>
                {children}
            </Suspense>
        </section>
    );
}
