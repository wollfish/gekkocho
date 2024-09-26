import React, { Suspense } from 'react';

import Loading from '@/app/pay/[id]/loading';
import { WidgetContainer } from '@/app/pay/utils';

export default function Page({ params }: { params: { id: string } }) {
    return (
        <Suspense fallback={<Loading/>}>
            <WidgetContainer id={params.id}/>
        </Suspense>
    );
}
