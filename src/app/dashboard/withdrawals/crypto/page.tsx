import React from 'react';

import { getAccountList, getWithdrawalList } from '@/actions/dashboard/account';
import { WithdrawList } from '@/app/dashboard/account/utils';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';

export const dynamic = 'force-dynamic';

export default async function Page() {
    let { data: accounts, error: accountError } = await getAccountList();
    let { data: withdrawals, error: withdrawalError } = await getWithdrawalList({ type: 'coin' });

    accounts ||= [];
    withdrawals ||= [];

    // TODO: remove this after backend fix
    const cryptoWithdrawals = withdrawals.filter((withdrawal) => withdrawal.type === 'coin');

    return (
        <DataPageTemplate error={withdrawalError || accountError}>
            <section className="flex grow flex-col overflow-auto py-4">
                <WithdrawList accounts={accounts} type="coin" withdrawals={cryptoWithdrawals}/>
            </section>
        </DataPageTemplate>
    );
}
