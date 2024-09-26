import React from 'react';

import { getPaymentInfo, getPaymentMethods } from '@/actions/pay';
import { DynamicPayWidget } from '@/app/pay/utils/DynamicPayWidget';

interface OwnProps {
    id: string
}

export async function WidgetContainer(props: OwnProps) {
    const { id } = props;

    const paymentInfo = await getPaymentInfo({ payment_id: id });
    let paymentMethods = null;

    //TODO: add error handling and Error Component

    if (!paymentInfo.success) {
        return <div className="text-center">{paymentInfo.error}</div>;
    }

    if (!paymentInfo.data?.network) {
        console.log('payment data', paymentInfo.data);

        paymentMethods = await getPaymentMethods({ payment_id: paymentInfo.data.uuid });

        if (!paymentMethods?.success) {
            return <div>{paymentMethods?.error}</div>;
        }
    }

    return (
        <div className="m-auto">
            <DynamicPayWidget paymentData={paymentInfo.data} paymentMethods={paymentMethods?.data}/>
        </div>
    );
}
