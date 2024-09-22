'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import { link } from '@/components/primitives';
import { siteConfig } from '@/config/site';

export const SettingsTabs = () => {
    const pathname = usePathname();

    return (
        <div className="border-b border-default text-sm font-medium">
            <ul className="-mb-px flex flex-wrap">
                {siteConfig.dashboardSettingsNavItems.map(({ path, label }) => (
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
};
