'use client';

import React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import { link } from '@/components/primitives';

interface OwnProps {
    tabs: { label: string, path: string }[];
}

export const DashboardTabs: React.FC<OwnProps> = React.memo((props) => {
    const pathname = usePathname();

    return (
        <div className="border-b border-default text-sm font-medium">
            <ul className="-mb-px flex flex-wrap">
                {props.tabs.map(({ path, label }) => (
                    <li key={path} className="me-2">
                        <NextLink
                            className={link().base({ type: 'tab', active: pathname === path, color: 'default' })}
                            href={path}
                        >
                            {label}
                        </NextLink>
                    </li>
                ))}
            </ul>
        </div>
    );
});
