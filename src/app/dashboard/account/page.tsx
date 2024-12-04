import React from 'react';

import { Divider } from '@nextui-org/divider';

import { getAccountList, getCurrencyList } from '@/actions/dashboard/account';
import { AccountList } from '@/app/dashboard/account/utils';
import { AccountOverviewCharts } from '@/app/dashboard/account/utils/AccountOverviewCharts';
import { subtitle } from '@/components/primitives';
import { PLATFORM_MAIN_CURRENCY, PLATFORM_USER_CURRENCY } from '@/config/site';
import { fetchData } from '@/lib/api';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';
import { convertAmount, convertAmountInMainCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

let chartData = [
    { currency: 'btc', name: 'Bitcoins', amount: 0, color: 'bg-cyan-500 dark:bg-cyan-500', share: '0' },
    { currency: 'eth', name: 'Ethereum', amount: 0, color: 'bg-blue-500 dark:bg-blue-500', share: '0' },
    { currency: 'usdt', name: 'Tether', amount: 0, color: 'bg-indigo-500 dark:bg-indigo-500', share: '0' },
    { currency: 'OTHER', name: 'Others', amount: 0, color: 'bg-violet-500 dark:bg-violet-500', share: '0' },
];

export default async function Page() {
    const { loading, data: accounts, error } = await fetchData(getAccountList);
    const {
        loading: currencyLoading,
        data: currency_list = [],
        error: currencyError,
    } = await fetchData(getCurrencyList);

    const findCurrency = (currencyId: string) => currency_list.find((currency) => currency.id === currencyId.toLowerCase());

    const mainCurrency = findCurrency(PLATFORM_MAIN_CURRENCY);
    const userCurrency = findCurrency(PLATFORM_USER_CURRENCY);

    const updatedAccounts = accounts.map((account) => {
        const avl_blc_in_main_currency = convertAmountInMainCurrency(account.balance, findCurrency(account.currency));
        const locked_blc_in_main_currency = convertAmountInMainCurrency(account.locked, findCurrency(account.currency));
        const total_blc_in_main_currency = avl_blc_in_main_currency + locked_blc_in_main_currency;

        const avl_blc_in_platform_currency = convertAmount(avl_blc_in_main_currency, mainCurrency, userCurrency)[0];
        const locked_blc_in_platform_currency = convertAmount(locked_blc_in_main_currency, mainCurrency, userCurrency)[0];
        const total_blc_in_platform_currency = avl_blc_in_platform_currency + locked_blc_in_platform_currency;

        return {
            ...account,
            main_currency: PLATFORM_MAIN_CURRENCY,
            user_currency: PLATFORM_USER_CURRENCY,
            total_blc: +account.balance + +account.locked,
            avl_blc_in_main_currency,
            locked_blc_in_main_currency,
            total_blc_in_main_currency,
            avl_blc_in_platform_currency,
            locked_blc_in_platform_currency,
            total_blc_in_platform_currency,
        };
    });

    const totalBlainPlatformCurrency = updatedAccounts.reduce((acc, account) => acc + account.total_blc_in_platform_currency, 0);
    const totalBlcInMainCurrency = updatedAccounts.reduce((acc, account) => acc + account.total_blc_in_main_currency, 0);

    const lockedBlcInMainCurrency = updatedAccounts.reduce((acc, account) => acc + account.locked_blc_in_main_currency, 0);
    const lockedBlcInPlatformCurrency = updatedAccounts.reduce((acc, account) => acc + account.locked_blc_in_platform_currency, 0);

    const updatedChartData = chartData.map((item) => {
        const account = updatedAccounts.find((account) => account.currency === item.currency);

        if (account) {
            item.amount = account.total_blc_in_platform_currency;
            item.share = ((account.total_blc_in_platform_currency / totalBlainPlatformCurrency) * 100).toFixed(2);
        }

        return item;
    });

    const updateChartDataOfOthers = updatedChartData.map((item) => {
        if (item.currency === 'OTHER') {
            item.amount = totalBlainPlatformCurrency - updatedChartData.reduce((acc, item) => acc + item.amount, 0);
            item.share = ((item.amount / totalBlainPlatformCurrency) * 100).toFixed(2);
        }

        return item;
    });

    return (
        <DataPageTemplate error={error} loading={loading}>
            <section className="flex flex-1 flex-col overflow-hidden py-4">
                <div className="relative mb-4 flex flex-wrap justify-between gap-4">
                    <div className="relative flex flex-col gap-3 pl-2">
                        <span className="absolute left-0 top-1 h-4 w-0.5 bg-default-500"/>
                        <h3 className={subtitle({ size: 'sm' })}>
                            Total Balance
                        </h3>
                        <div className={subtitle({ size: 'xl' })}>
                            {totalBlainPlatformCurrency.toFixed(2)} {PLATFORM_USER_CURRENCY}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-default-500">
                            ~ {totalBlcInMainCurrency.toFixed(2)} {PLATFORM_MAIN_CURRENCY}
                        </div>
                    </div>
                    <div className="relative flex flex-col gap-3 pl-2">
                        <span className="absolute left-0 top-1 h-4 w-0.5 bg-default-500"/>
                        <h3 className={subtitle({ size: 'sm' })}>Locked Balance </h3>
                        <div className={subtitle({ size: 'xl' })}>
                            {lockedBlcInPlatformCurrency.toFixed(2)} {PLATFORM_USER_CURRENCY}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-default-500">
                            ~ {lockedBlcInMainCurrency.toFixed(2)} {PLATFORM_MAIN_CURRENCY}
                        </div>
                    </div>
                    <AccountOverviewCharts data={updateChartDataOfOthers}/>
                </div>
                <Divider/>
                <section className="flex grow flex-col overflow-auto py-4">
                    <AccountList accounts={updatedAccounts}/>
                </section>
            </section>
        </DataPageTemplate>
    );
}
