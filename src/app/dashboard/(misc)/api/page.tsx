import React from 'react';

import { getApiKeyList } from '@/actions/dashboard/settings';
import { ApiList } from '@/app/dashboard/(misc)/api/ApiList';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';

export const dynamic = 'force-dynamic';

export default async function Page() {
    let { data: apiKeys, error: apiKeysError } = await getApiKeyList();

    apiKeys ||= [];

    return (
        <DataPageTemplate error={apiKeysError}>
            <section className="flex grow flex-col overflow-auto py-4">
                <ApiList apiKeys={apiKeys}/>
            </section>
        </DataPageTemplate>
    );
}
