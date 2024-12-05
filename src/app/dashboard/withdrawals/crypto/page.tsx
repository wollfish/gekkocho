import React from 'react';

import { getAccountList, getWithdrawalList } from '@/actions/dashboard/account';
import { WithdrawList } from '@/app/dashboard/account/utils';
import { fetchData } from '@/lib/api';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';

export const dynamic = 'force-dynamic';

export default async function Page() {
    const {
        loading: withdrawalLoading,
        data: withdrawals,
        error: withdrawalError,
    } = await fetchData(() => getWithdrawalList({ type: 'coin' }));

    const {
        loading: accountLoading,
        data: accounts,
        error: accountError,
    } = await fetchData(getAccountList);

    // TODO: remove this after backend fix
    const cryptoWithdrawals = withdrawals.filter((withdrawal) => withdrawal.type === 'coin');

    return (
        <DataPageTemplate
            error={withdrawalError || accountError}
            loading={withdrawalLoading || accountLoading}
        >
            <section className="flex grow flex-col overflow-auto py-4">
                <WithdrawList accounts={accounts} type="coin" withdrawals={cryptoWithdrawals}/>
            </section>
        </DataPageTemplate>
    );
}
