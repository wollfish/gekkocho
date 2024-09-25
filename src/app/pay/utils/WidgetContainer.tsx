import React from 'react';

import { getPaymentInfo } from '@/actions/pay';

interface OwnProps {
    id: string
}

export async function WidgetContainer(props: OwnProps) {
    const { id } = props;
    const { data } = await getPaymentInfo({ payment_id: id });

    // TODO: Work in progress
    return (
        <div className="m-auto">
            {JSON.stringify(data)}
        </div>
    );
};
