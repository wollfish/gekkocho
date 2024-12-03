import React from 'react';

import { Divider } from '@nextui-org/divider';

import { getAccountList } from '@/actions/dashboard/account';
import { AccountList } from '@/app/dashboard/account/utils';
import { AccountOverviewCharts } from '@/app/dashboard/account/utils/AccountOverviewCharts';
import { subtitle } from '@/components/primitives';
import { fetchData } from '@/lib/api';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';

const data1 = [
    {
        name: 'Bitcoins',
        amount: 6730,
        share: '32.1%',
        color: 'bg-cyan-500 dark:bg-cyan-500',
    },
    {
        name: 'Ethereum',
        amount: 4120,
        share: '19.6%',
        color: 'bg-blue-500 dark:bg-blue-500',
    },
    {
        name: 'Tether',
        amount: 3920,
        share: '18.6%',
        color: 'bg-indigo-500 dark:bg-indigo-500',
    },
    {
        name: 'Others',
        amount: 3210,
        share: '29.64%',
        color: 'bg-violet-500 dark:bg-violet-500',
    },
];

export const dynamic = 'force-dynamic';

export default async function Page() {
    const { loading, data: accounts, error } = await fetchData(getAccountList);

    return (
        <DataPageTemplate data={accounts} error={error} loading={loading}>
            <section className="flex flex-1 flex-col overflow-hidden py-4">
                <div className="relative mb-4 flex flex-wrap justify-between gap-4">
                    <div className="relative flex flex-col gap-3 pl-2">
                        <span className="absolute left-0 top-1 h-4 w-0.5 bg-default-500"/>
                        <h3 className={subtitle({ size: 'sm' })}>Total Balance</h3>
                        <div className={subtitle({ size: 'xl' })}>590,9087,788.00 AED</div>
                        <div className="flex items-center gap-1 text-sm text-default-500">
                            ~ 667,689.99 USDT
                        </div>
                    </div>
                    <div className="relative flex flex-col gap-3 pl-2">
                        <span className="absolute left-0 top-1 h-4 w-0.5 bg-default-500"/>
                        <h3 className={subtitle({ size: 'sm' })}>Locked Balance </h3>
                        <div className={subtitle({ size: 'xl' })}>590,9087,788.00 AED</div>
                        <div className="flex items-center gap-1 text-sm text-default-500">
                            ~ 667,689.99 USDT
                        </div>
                    </div>
                    <AccountOverviewCharts data={data1}/>
                </div>
                <Divider/>
                <section className="flex grow flex-col overflow-auto py-4">
                    <AccountList accounts={accounts}/>
                </section>
            </section>
        </DataPageTemplate>
    );
}
