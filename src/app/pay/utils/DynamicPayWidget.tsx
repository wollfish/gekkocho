import React from 'react';
import { Divider } from '@nextui-org/divider';

import { Snippet } from '@nextui-org/snippet';

import { PaymentMethodForm } from '@/app/pay/utils/PaymentMethodForm';
import { ReloadBtn } from '@/app/pay/utils/reload';
import { Icons, Logo } from '@/components/icons';
import { QRCodeGenerator } from '@/components/qrCodeGenerator';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { PaymentMethodInterface, PaymentResponseInterface } from '@/lib/zod';

interface OwnProps {
    paymentData: PaymentResponseInterface;
    paymentMethods: PaymentMethodInterface[];
}

const networkClass = 'mx-auto mb-2 flex w-fit items-center gap-2 rounded border border-dashed px-2 py-1 text-sm dark:border-default';
const wrapperClass = 'w-full rounded-lg border border-dashed bg-white shadow-lg contain-content dark:border-default dark:bg-default-50 md:w-[380px]';

export const DynamicPayWidget: React.FC<OwnProps> = async (props) => {
    const {
        order_id,
        network,
        payer_amount,
        address,
        payer_currency,
        amount,
        currency,
        currency_type,
        expired_at,
        uuid,
        status,
    } = props.paymentData;

    return (
        <section className={wrapperClass}>
            <div className="bg-default-100 p-4" slot="header">
                <div className="flex items-center justify-between">
                    <div className="-ml-1 flex items-center gap-1">
                        <Logo size={32}/>
                        <p className="font-bold">CoinDhan Pay</p>
                    </div>
                    <div>Order Id: <span className="text-sm font-semibold">#{order_id}</span></div>
                </div>
                <div className="font-semibold capitalize">
                    {`Amount: ${amount} ${currency.toUpperCase()}`}
                </div>
                <div className="absolute right-4"><ReloadBtn/></div>
            </div>
            <div className="p-4" slot="body">
                {!network && props.paymentMethods
                    ? <PaymentMethodForm methods={props.paymentMethods} uuid={uuid}/>
                    : <div>
                        <div className={networkClass}>
                            <span>Network :</span>
                            <span className="flex items-center justify-center font-semibold">
                                <Icons.eth/>
                                <span className="ml-1 mr-2">{network}</span>
                                <Icons.info className="text-primary"/>
                            </span>
                        </div>
                        <QRCodeGenerator value={address}/>
                        <div className="mb-4">
                            <div className="mb-1 text-sm font-semibold">Amount:</div>
                            <Snippet
                                hideSymbol
                                className="w-full"
                                classNames={{ pre: 'break-all whitespace-normal' }}
                                radius="sm"
                            >
                                {`${payer_amount} ${payer_currency}`}
                            </Snippet>
                        </div>
                        <div className="mb-4">
                            <div className="mb-1 text-sm font-semibold">Address:</div>
                            <Snippet
                                hideSymbol
                                className="w-full"
                                classNames={{ pre: 'break-all whitespace-normal' }}
                                radius="sm"
                            >
                                {address}
                            </Snippet>
                        </div>
                    </div>}
            </div>
            <Divider/>
            <div className="flex items-center justify-center gap-1 p-4 text-sm" slot="footer">
                <span>Time Remaining:</span>
                <CountdownTimer endTime={expired_at}/>
            </div>
        </section>
    );
};
