'use client';

import React from 'react';

import { subtitle } from '@/components/primitives';
import { PLATFORM_CURRENCY } from '@/config/site';
import { DonutChart } from '@/termor_components/DonutChart';
import { cx } from '@/termor_lib/utils';

interface OwnProps {
    data: {
        name: string;
        amount: number;
        share: string;
        color: string;
    }[];
}

const currencyFormatter = (number: number) => Intl.NumberFormat('us').format(number).toString() + ' ' + PLATFORM_CURRENCY;

export const AccountOverviewCharts: React.FC<OwnProps> = React.memo(({ data }) => {
    return (
        <section className="">
            <div className="flex items-center gap-8">
                <DonutChart
                    category="name"
                    colors={['blue', 'violet', 'cyan', 'indigo']}
                    data={data}
                    showLabel={true}
                    showTooltip={true}
                    value="amount"
                    valueFormatter={currencyFormatter}
                />
                <div>
                    <p className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                        <span>Category</span>
                        <span>Amount / Share</span>
                    </p>
                    <ul className="mt-2 divide-y divide-gray-200 text-sm text-gray-500 dark:divide-gray-800 dark:text-gray-500">
                        {data.map((item) => (
                            <li
                                key={item.name}
                                className="relative flex items-center justify-between gap-4 py-2"
                            >
                                <div className="flex items-center space-x-2.5 truncate">
                                    <span
                                        aria-hidden={true}
                                        className={cx(item.color, 'size-2.5 shrink-0 rounded-sm')}
                                    />
                                    <span className="truncate dark:text-gray-300">{item.name}</span>
                                </div>
                                <p className="flex items-center space-x-2">
                                    <span className="font-medium tabular-nums text-gray-900 dark:text-gray-50">
                                        {currencyFormatter(item.amount)}
                                    </span>
                                    <span
                                        className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-medium tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                        {item.share}
                                    </span>
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="mt-4">
                <h3 className={subtitle({ size: 'xs', className: 'text-right text-default-600' })}>
                    i. Total balance by currency in {PLATFORM_CURRENCY}
                </h3>
            </div>
        </section>
    );
});
