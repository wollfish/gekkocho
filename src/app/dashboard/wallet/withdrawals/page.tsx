import React from 'react';

import { getWithdrawalList } from '@/actions/dashboard/wallet';
import { WithdrawList } from '@/app/dashboard/wallet/utils';

export default async function Page() {
    const { data } = await getWithdrawalList();

    return (
        <section className="flex grow flex-col overflow-auto py-4">
            <WithdrawList data={data}/>
        </section>
    );
}
