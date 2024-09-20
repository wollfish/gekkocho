import React from 'react';

import { SettingsTabs } from '@/components/dashboard/SettingsTabs';
import { Breadcrumbs } from '@/components/ui/Breadcrumb';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="flex size-full flex-col pr-16" aria-label="Settings Layout">
            <Breadcrumbs/>
            <SettingsTabs/>
            {children}
        </section>
    );
}
