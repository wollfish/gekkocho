import React, { Suspense } from 'react';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getPaymentInfoPublic } from '@/actions/dashboard/payment';
import Loading from '@/app/pay/[id]/loading';
import { DynamicPayWidget } from '@/app/pay/utils';

export default async function Page({ params }: { params: { id: string } }) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['payment_info', params.id],
        queryFn: () => getPaymentInfoPublic({ id: params.id }),
    });

    return (
        <Suspense fallback={<Loading/>}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <DynamicPayWidget id={params.id}/>
            </HydrationBoundary>
        </Suspense>
    );
}
