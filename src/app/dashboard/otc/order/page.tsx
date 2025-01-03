import React from 'react';

import { getOtcOrderList } from '@/actions/dashboard/otc';
import { OtcOrderForm, OtcOrderList } from '@/app/dashboard/otc/utils';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';

export const dynamic = 'force-dynamic';

export default async function Page() {
    let { data: otcOrderList, error: OtcOrderListError } = await getOtcOrderList();

    otcOrderList ||= [];

    return (
        <DataPageTemplate error={OtcOrderListError}>
            <section className="flex grow flex-col overflow-auto py-4">
                <section className="mb-8 rounded bg-default-50 p-4 shadow dark:bg-default-50">
                    <OtcOrderForm/>
                </section>
                <OtcOrderList data={otcOrderList}/>
            </section>
        </DataPageTemplate>
    );
}
