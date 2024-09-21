import React, { Suspense } from 'react';

import { SettingsTabs } from '@/components/dashboard/SettingsTabs';
import { Breadcrumbs } from '@/components/ui/Breadcrumb';

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
