import React from 'react';

import { getAccountList, getWithdrawalList } from '@/actions/dashboard/account';
import { WithdrawList } from '@/app/dashboard/account/utils';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';

export const dynamic = 'force-dynamic';

export default async function Page() {
    let { data: accounts, error: accountError } = await getAccountList();
    let { data: withdrawals, error: withdrawalError } = await getWithdrawalList({ type: 'fiat' });

    accounts ||= [];
    withdrawals ||= [];

    // TODO: remove this after backend fix
    const fiatWithdrawals = withdrawals.filter((withdrawal) => withdrawal.type === 'fiat');

    return (
        <DataPageTemplate error={withdrawalError || accountError}>
            <section className="flex grow flex-col overflow-auto py-4">
                <WithdrawList accounts={accounts} type="fiat" withdrawals={fiatWithdrawals}/>
            </section>
        </DataPageTemplate>
    );
}
