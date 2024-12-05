'use client';

import React from 'react';

import NextLink from 'next/link';

import { usePathname } from 'next/navigation';

import { doLogout } from '@/actions/auth';
import { Icons, Logo } from '@/components/icons';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

export const DashboardSideNav: React.FC = React.memo(() => {
    const path = usePathname();

    const iconClasses = 'text-xl text-default-500 pointer-events-none flex-shrink-0';
    const itemClasses = 'flex cursor-pointer w-full items-center gap-2 rounded-small p-2 transition-background hover:bg-default-100/50 hover:backdrop-blur-sm';

    return (
        <aside className="sticky top-0 z-10 flex h-screen w-64 flex-col overflow-y-hidden border-r border-divider">
            <div className="flex h-16 items-center border-b border-dashed border-divider">
                <NextLink className="flex items-center gap-1 p-3" href="/">
                    <Logo size={32}/>
                    <p className="font-bold">CoinDhan Admin</p>
                </NextLink>
            </div>
            <div className="no-scrollbar flex grow flex-col overflow-y-auto duration-300 ease-linear">
                <ul className="flex w-full flex-col gap-2 p-2 text-sm">
                    {siteConfig.dashboardSideNavItems.map((item) => {
                        const isActive = item.exact ? item.href === path : path.includes(item.parent);

                        return (
                            <li key={item.href}>
                                <NextLink className={cn(itemClasses, {
                                    'bg-default-100/50 backdrop-blur-sm': isActive,
                                })} href={item.href}>
                                    {item.icon && <item.icon className={cn(iconClasses, {
                                        'text-primary': isActive,
                                    })}/>}
                                    <span>{item.label}</span>
                                </NextLink>
                            </li>
                        );
                    })}
                </ul>
                <div className="mt-auto flex w-full flex-col gap-2 p-2 text-sm">
                    <form action={doLogout} className="text-danger">
                        <button className={itemClasses} type="submit">
                            {<Icons.flower className={cn(iconClasses, 'text-danger')}/>}
                            <span>Logout</span>
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    );
});
