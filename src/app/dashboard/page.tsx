import React from 'react';
import { Divider } from '@nextui-org/divider';

import { PaymentOverviewCharts } from '@/app/dashboard/payments/utils/PaymentOverviewCharts';
import { WalletOverviewCharts } from '@/app/dashboard/wallet/utils';
import { subtitle } from 'src/components/primitives';

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

const data2 = [
    {
        name: 'Litecoin',
        amount: 2150,
        share: '10.4%',
        color: 'bg-cyan-500 dark:bg-cyan-500',
    },
    {
        name: 'Ripple',
        amount: 1875,
        share: '9.1%',
        color: 'bg-blue-500 dark:bg-blue-500',
    },
    {
        name: 'Cardano',
        amount: 1580,
        share: '7.6%',
        color: 'bg-indigo-500 dark:bg-indigo-500',
    },
    {
        name: 'Polkadot',
        amount: 1250,
        share: '6.2%',
        color: 'bg-violet-500 dark:bg-violet-500',
    },
];

const data3 = [
    {
        name: 'Binance Coin',
        amount: 3410,
        share: '34.5%',
        color: 'bg-cyan-500 dark:bg-cyan-500',
    },
    {
        name: 'Solana',
        amount: 2990,
        share: '30.3%',
        color: 'bg-blue-500 dark:bg-blue-500',
    },
    {
        name: 'Dogecoin',
        amount: 1780,
        share: '18.0%',
        color: 'bg-indigo-500 dark:bg-indigo-500',
    },
    {
        name: 'Shiba Inu',
        amount: 1120,
        share: '17.2%',
        color: 'bg-violet-500 dark:bg-violet-500',
    },
];

export default function DashboardPage() {
    return (
        <div>
            <p className={subtitle({ size: 'lg', className: 'mr-auto text-default-600 font-bold' })}>
                This Week’s Overview
            </p>
            <div className="relative my-4 flex flex-wrap justify-between gap-4">
                <WalletOverviewCharts data={data1}/>
                <WalletOverviewCharts data={data2}/>
                <WalletOverviewCharts data={data3}/>
            </div>
            <Divider/>
            <PaymentOverviewCharts/>
            <PaymentOverviewCharts/>
        </div>
    );
}
