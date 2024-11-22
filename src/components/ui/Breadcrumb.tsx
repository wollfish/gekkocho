'use client';

import React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import { link } from '@/components/primitives';

export const Breadcrumbs: React.FC = React.memo(() => {
    const paths = usePathname();
    const pathNames = paths.split('/').filter((item) => item.length > 0);

    return (
        <div aria-label="breadcrumb" className="flex">
            <ul className="ml-auto flex text-sm">
                {pathNames.map((path, index) => {
                    const href = `/${pathNames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathNames.length - 1;

                    return (
                        <li key={path} className="flex items-center">
                            <NextLink
                                className={link().base({
                                    color: 'default',
                                    className: !isLast && 'text-default-400',
                                })}
                                href={href}
                            >
                                {path.charAt(0).toUpperCase() + path.slice(1)}
                            </NextLink>
                            {index < pathNames.length - 1 && (
                                <span className="mx-2 text-gray-500">/</span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
});
