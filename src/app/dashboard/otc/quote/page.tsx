import React from 'react';

import { getOtcQuoteList } from '@/actions/dashboard/otc';
import { OtcQuoteForm, OtcQuoteList } from '@/app/dashboard/otc/utils';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';

export const dynamic = 'force-dynamic';

export default async function Page() {
    let { data: otcQuoteList, error: OtcQuoteListError } = await getOtcQuoteList();

    otcQuoteList ||= [];

    return (
        <DataPageTemplate error={OtcQuoteListError}>
            <section className="flex grow flex-col overflow-auto py-4">
                <section className="mb-8 rounded bg-default-50 p-4 shadow dark:bg-default-50">
                    <OtcQuoteForm/>
                </section>
                <OtcQuoteList data={otcQuoteList}/>
            </section>
        </DataPageTemplate>
    );
}
