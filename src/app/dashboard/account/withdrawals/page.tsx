import React from 'react';

import { getWithdrawalList } from '@/actions/dashboard/account';
import { WithdrawList } from '@/app/dashboard/account/utils';
import { fetchData } from '@/lib/api';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';

export default async function Page() {
    const { loading, data, error } = await fetchData(getWithdrawalList);

    return (
        <DataPageTemplate data={data} error={error} loading={loading}>
            <section className="flex grow flex-col overflow-auto py-4">
                <WithdrawList data={data}/>
            </section>
        </DataPageTemplate>
    );
}
