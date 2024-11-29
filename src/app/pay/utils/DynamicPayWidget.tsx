'use client';

import React from 'react';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';
import { Snippet } from '@nextui-org/snippet';
import { Spinner } from '@nextui-org/spinner';
import { Tooltip } from '@nextui-org/tooltip';
import { useQuery } from '@tanstack/react-query';

import NextLink from 'next/link';

import { getPaymentInfo, getPaymentMethods } from '@/actions/pay';
import { PaymentMethodForm } from '@/app/pay/utils/PaymentMethodForm';
import { ReloadBtn } from '@/app/pay/utils/reload';
import { Icons, Logo } from '@/components/icons';
import { QRCodeGenerator } from '@/components/qrCodeGenerator';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { cn } from '@/lib/utils';

const WRAPPER_CLASS = 'w-full rounded-lg border border-dashed bg-white shadow-lg contain-content dark:border-default dark:bg-default-50 md:max-w-md min-w-[380px]';
const NETWORK_CLASS = 'mx-auto mb-2 flex w-fit items-center gap-2 rounded border border-dashed px-2 py-1 text-sm dark:border-default';

export const DynamicPayWidget: React.FC<{ id: string }> = (props) => {
    const { data: payment, isLoading: paymentLoading } = useQuery({
        queryKey: ['payment_info', props.id],
        queryFn: () => getPaymentInfo({ payment_id: props.id }),
        refetchInterval: 10000,
        refetchOnWindowFocus: true,
    });

    const { data: paymentMethods, isLoading: paymentMethodsLoading } = useQuery({
        queryKey: ['payment_methods'],
        queryFn: () => getPaymentMethods(),
    });

    if (paymentLoading || paymentMethodsLoading) {
        return (
            <section className="flex items-center justify-center">
                <Spinner/>
            </section>
        );
    }

    const {
        id,
        initiated_at,
        address,
        pay_blockchain,
        pay_amount,
        created_at,

        expired_at,
        pay_currency,
        req_amount,
        exchange_rate,
        state,
        req_currency,
        redirect_url,
        reference_id,
    } = payment?.data || {};

    if (!payment.data) {
        return (
            <section className={cn(WRAPPER_CLASS, 'shadow-none')}>
                <div className="flex flex-col items-center justify-center p-4 text-sm">
                    <p className="mb-4 text-center">No payment found by this ID: <span
                        className="font-semibold">{props.id}</span></p>
                    <Button as={NextLink} color="primary" href="/" radius="full" startContent={<Icons.home/>}
                        variant="flat">
                        Go home
                    </Button>
                </div>
            </section>
        );
    }

    const renderData = () => {
        if (state === 'success') {
            return (
                <div className="flex flex-col items-center justify-center gap-4 p-4 text-sm">
                    <Icons.check className="text-green-500" size={32}/>
                    <p className="font-semibold">Payment is successful</p>
                    <p>For Order ID: <b>{reference_id}</b></p>
                    <p>Request Amount: {req_amount} {req_currency?.toUpperCase()}</p>
                    <p>Payment Amount: {pay_amount} {pay_currency?.toUpperCase()}</p>
                    <Button
                        as={NextLink}
                        color="primary"
                        href={redirect_url}
                        radius="full" startContent={<Icons.home/>}
                        variant="flat"
                    >
                        Go home
                    </Button>
                </div>
            );
        }
        if (state === 'error') {
            return (
                <div className="flex flex-col items-center justify-center gap-4 p-4 text-sm">
                    <Icons.cancel className="text-red-500" size={32}/>
                    <p className="font-semibold">Payment is failed</p>
                    <p>For Order ID: <b>{reference_id}</b></p>
                    <p>Request Amount: {req_amount} {req_currency?.toUpperCase()}</p>
                    <p>Payment Amount: {pay_amount ?? '-'} {pay_currency?.toUpperCase()}</p>
                    <Button
                        as={NextLink} color="primary"
                        href={redirect_url}
                        radius="full"
                        startContent={<Icons.home/>}
                        variant="flat"
                    >
                        Go home
                    </Button>
                </div>
            );
        }
        if (state === 'pending') {
            return (
                <PaymentMethodForm
                    methods={paymentMethods.data}
                    reqAmount={req_amount} reqCurrency={req_currency}
                    uuid={id}
                />
            );
        } else {
            return (
                <div>
                    <div className={NETWORK_CLASS}>
                        <span>Network :</span>
                        <span className="flex items-center justify-center font-semibold">
                            <span className="ml-1 mr-2 uppercase">{pay_blockchain}</span>
                            <Tooltip content="You pay network fee" radius="sm">
                                <Button className="!size-4 min-w-0" isIconOnly={true} radius="full" variant="light">
                                    <Icons.info
                                        aria-label="More information about Network"
                                        className="text-primary"
                                    />
                                </Button>
                            </Tooltip>
                        </span>
                    </div>
                    <QRCodeGenerator value={address}/>
                    <div className="mb-4">
                        <div className="mb-1 text-sm font-semibold">Pay amount:</div>
                        <Snippet
                            hideSymbol
                            className="w-full"
                            classNames={{ pre: 'break-all whitespace-normal' }}
                            codeString={pay_amount}
                            radius="sm"
                        >
                            {[pay_amount, pay_currency?.toUpperCase()].join(' ')}
                        </Snippet>
                    </div>
                    <div className="mb-4">
                        <div className="mb-1 text-sm font-semibold">To address:</div>
                        <Snippet
                            hideSymbol
                            className="w-full"
                            classNames={{ pre: 'break-all whitespace-normal' }}
                            radius="sm"
                        >
                            {address || '-'}
                        </Snippet>
                    </div>
                </div>
            );
        }
    };

    return (
        <section className={WRAPPER_CLASS}>
            <div className="bg-default-100 p-4" slot="header">
                <div className="flex items-center justify-between">
                    <div className="-ml-1 flex items-center gap-1">
                        <Logo size={32}/>
                        <p className="font-bold">CoinDhan Pay</p>
                    </div>
                    <div>Order Id: <span className="text-sm font-semibold">#{reference_id}</span></div>
                </div>
                <div className="capitalize">
                    <span>Amount: </span>
                    <span className="font-semibold uppercase">{req_amount} {req_currency}</span>
                </div>
                <div className="absolute right-4"><ReloadBtn/></div>
            </div>
            <div className="p-4" slot="body">
                {renderData()}
            </div>
            <Divider/>
            <div className="flex items-center justify-center gap-1 p-4 text-sm" slot="footer">
                <span>Time Remaining:</span>
                <CountdownTimer endTime={expired_at}/>
            </div>
        </section>
    );
};
