import React from 'react';

import { getApiKeyList } from '@/actions/dashboard/settings';
import { ApiList } from '@/app/dashboard/(misc)/api/ApiList';
import { fetchData } from '@/lib/api';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';

export const dynamic = 'force-dynamic';

export default async function Page() {
    const { loading, data: apiKeys = [], error: apiKeysError } = await fetchData(getApiKeyList);

    return (
        <DataPageTemplate error={apiKeysError} loading={loading}>
            <section className="flex grow flex-col overflow-auto py-4">
                <ApiList apiKeys={apiKeys} />
            </section>
        </DataPageTemplate>
    );
}
