import React, { Suspense } from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Payments',
};
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <section aria-label="Payment Layout" className="flex size-full flex-col pr-16">
            <Suspense>
                {children}
            </Suspense>
        </section>
    );
}
