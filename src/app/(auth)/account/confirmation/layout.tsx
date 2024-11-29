import React, { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode; }) {
    return (
        <div className="flex w-full items-center justify-center">
            <Suspense>
                {children}
            </Suspense>
        </div>
    );
}
