import 'src/styles/globals.css';

import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata, Viewport } from 'next';

import { figTree } from '@/config/fonts';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

import { Providers } from './providers';

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    icons: {
        icon: '/images/favicon.ico',
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
    ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html suppressHydrationWarning lang="en">
            <body
                className={cn('min-h-screen bg-background antialiased ', figTree.className)}
            >
                <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark', children: '' }}>
                    {children}
                    <SpeedInsights/>
                </Providers>
            </body>
        </html>
    );
}
