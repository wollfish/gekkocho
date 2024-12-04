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
    } = await fetchData(getWithdrawalList);

    const {
        loading: accountLoading,
        data: accounts,
        error: accountError,
    } = await fetchData(getAccountList);

    return (
        <DataPageTemplate
            error={withdrawalError || accountError}
            loading={withdrawalLoading || accountLoading}
        >
            <section className="flex grow flex-col overflow-auto py-4">
                <WithdrawList accounts={accounts} withdrawals={withdrawals}/>
            </section>
        </DataPageTemplate>
    );
}
