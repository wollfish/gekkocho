'use client';

import React, { useEffect } from 'react';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';
import { Snippet } from '@nextui-org/snippet';
import { Spinner } from '@nextui-org/spinner';
import { Tooltip } from '@nextui-org/tooltip';
import { useQuery } from '@tanstack/react-query';

import { useTimeout } from 'ahooks';

import { useRouter } from 'next/navigation';

import { getCurrencyList } from '@/actions/dashboard/account';

import { getPaymentInfoPublic, getPaymentMethods } from '@/actions/dashboard/payment';
import { PaymentMethodForm } from '@/app/pay/utils/PaymentMethodForm';
import { Icons } from '@/components/icons';
import { description, subtitle, title } from '@/components/primitives';
import { QRCodeGenerator } from '@/components/qrCodeGenerator';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { cn, formatNumber } from '@/lib/utils';

const Instruction: React.FC = React.memo(() => {
    return (
        <div>
            <h3 className={subtitle({ size: 'sm', className: 'mb-2 text-danger-600' })}>
                Important Note:
            </h3>
            <Divider className="text-default-500"/>
            <ul className={description({
                size: 'xs',
                className: 'list-outside list-disc ml-3 flex flex-col gap-1',
            })}>
                <li>Always verify the recipient’s wallet address carefully; crypto transactions are
                    irreversible.
                </li>
                <li>Ensure the recipient’s wallet supports the same blockchain network as the one you’re
                    using (e.g., Bitcoin, Ethereum).
                </li>
                <li>Choosing the correct network and protocol is crucial to ensure your transaction is
                    successful and your funds are not lost.
                </li>
                <li>Customer is solely responsible for verifying wallet addresses,
                    network selection, and transaction details..
                </li>
                <li>
                    <span className="font-semibold">No Recovery for Errors:</span>
                    The company is not liable for funds lost due to incorrect
                    details, misdirected payments, or unsupported networks.
                </li>
            </ul>
        </div>
    );
});

const WRAPPER_CLASS = 'w-full border border-dashed bg-white contain-content dark:border-default dark:bg-default-50 md:max-w-md min-w-[420px]';
const NETWORK_CLASS = 'mx-auto mb-2 flex w-fit items-center gap-2 rounded border border-dashed px-2 py-1 text-sm dark:border-default';

export const DynamicPayWidget: React.FC<{ id: string }> = (props) => {
    const [enablePaymentDataFetch, setEnablePaymentDataFetch] = React.useState(true);
    const router = useRouter();

    const { data: payment, isLoading: paymentLoading } = useQuery({
        queryKey: ['payment_info', props.id],
        queryFn: () => getPaymentInfoPublic({ id: props.id }),
        refetchInterval: 5000,
        refetchOnWindowFocus: true,
        enabled: enablePaymentDataFetch,
    });

    const { data: paymentMethods, isLoading: paymentMethodsLoading } = useQuery({
        queryKey: ['payment_methods'],
        queryFn: () => getPaymentMethods(),
        enabled: !paymentLoading && payment?.data?.state === 'pending',
    });

    const { data: currencies, isLoading: currenciesLoading } = useQuery({
        queryKey: ['currencies'],
        queryFn: () => getCurrencyList(),
    });

    useTimeout(doRedirect, 5000);

    useEffect(() => {
        setEnablePaymentDataFetch(!['completed', 'rejected'].includes(payment?.data?.state));
    }, [payment]);

    function doRedirect() {
        if (['completed', 'rejected'].includes(payment?.data?.state) && payment?.data?.redirect_url) {
            router.push(payment.data.redirect_url + '?payment_id=' + id + '&reference_id=' + payment.data.reference_id);
        }
    }

    const payCurrency = currencies?.data?.find((c) => c.id === payment?.data?.pay_currency);

    const {
        id,
        initiated_at,
        address,
        description: product_name,
        pay_blockchain,
        pay_amount,
        pay_protocol,

        expired_at,
        pay_currency,
        req_amount,
        exchange_rate,
        org_name,
        state,
        req_currency,
        redirect_url,
        reference_id,
    } = payment?.data || {};

    if (paymentLoading || paymentMethodsLoading) {
        return (
            <section className="m-auto flex items-center justify-center">
                <Spinner/>
            </section>
        );
    }

    if (!payment?.data) {
        return (
            <section className={cn(WRAPPER_CLASS, 'shadow-none m-auto')}>
                <div className="m-auto flex flex-col items-center justify-center p-4 text-sm">
                    <p className="mb-4 text-center">No payment found by ID:
                        <span className="font-semibold">{props.id}</span>
                    </p>
                    <p className={description({ size: 'xs', className: 'text-center' })}>
                        Contact us if you have any questions
                    </p>
                    <div className="flex gap-2"><Icons.send/><Icons.headphone/></div>
                </div>
            </section>
        );
    }

    const renderQR = () => {
        if (state === 'accepted') {
            return (
                <div className="m-auto flex h-[160px] flex-col items-center justify-center p-4 text-center">
                    <Spinner className="m-auto" color="default"/>
                    <p className={description({ size: 'xs' })}>
                        Generating Payment Address...
                    </p>
                </div>
            );
        }

        return (
            <QRCodeGenerator icon={payCurrency?.icon_url} value={address}/>
        );
    };

    const renderData = () => {
        if (state === 'completed') {
            return (
                <div className="m-auto flex flex-col items-center justify-center gap-4 p-4 text-sm">
                    <Icons.check className="text-green-500" size={32}/>
                    <p className="font-semibold">Payment Successful</p>
                    <p>For Order ID: <b>#{reference_id}</b></p>
                    <p>Received Amount: {pay_amount} {pay_currency?.toUpperCase()}</p>
                    {redirect_url && <p>You will be redirected in <b>5sec</b></p>}
                </div>
            );
        }
        if (state === 'rejected') {
            return (
                <div className="m-auto flex flex-col items-center justify-center gap-4 p-4 text-sm">
                    <Icons.cancel className="text-red-500" size={32}/>
                    <p className="font-semibold">Payment Failed</p>
                    <p>For Order ID: <b>#{reference_id}</b></p>
                    <p>Requested Amount: {pay_amount} {pay_currency?.toUpperCase()}</p>
                    <p>Received Amount: {0} {pay_currency?.toUpperCase()}</p>
                    {redirect_url && <p>You will be redirected in <b>5sec</b></p>}
                </div>
            );
        }
        if (state === 'pending') {
            return (
                <PaymentMethodForm
                    methods={paymentMethods?.data}
                    payment={payment?.data}
                    uuid={id}
                />
            );
        } else {
            return (
                <div className="my-auto">
                    <div className={NETWORK_CLASS}>
                        <span>Network :</span>
                        <span className="flex items-center justify-center font-semibold">
                            <span className="ml-1 mr-2 uppercase">{pay_protocol}</span>
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
                    {renderQR()}
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
                        <p className="mt-1 text-xs font-semibold text-default-500">
                            <span>Exchange Rate: </span>
                            <span className="uppercase">
                                {`1 ${pay_currency} = ${Number(exchange_rate)?.toFixed(2)} ${req_currency}`}
                            </span>
                        </p>
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
                    <Divider/>
                    <div className="flex items-center justify-center gap-1 p-4 text-sm" slot="footer">
                        <span>Time Remaining:</span>
                        <CountdownTimer endTime={expired_at}/>
                    </div>
                </div>
            );
        }
    };

    console.info(payment);

    return (
        <section className="flex size-full border-y border-divider bg-default-100/50">
            <div
                className="m-auto grid w-[1020px] grid-cols-1 gap-y-4 rounded bg-white py-8 shadow dark:bg-default-50/60 sm:h-4/5 sm:grid-cols-2">
                <section className="flex flex-col border-default px-8">
                    <div className="mb-4">
                        <p className={subtitle()}>
                            {/*<span>Payment to:</span>*/}
                            <span className="text-secondary">{org_name}</span>
                        </p>
                        <p className={subtitle({ size: 'sm', className: 'text-default-500' })}>
                            Order ID: #{reference_id}
                        </p>
                        <h2 className={title({ size: 'xs', className: 'mt-4 uppercase' })}>
                            {formatNumber(req_amount)} {req_currency}
                        </h2>
                        <p className={subtitle({ size: 'md', className: 'text-default-700' })}>
                            {product_name}
                        </p>
                    </div>
                    <div className="mt-auto hidden sm:block">
                        <Instruction/>
                    </div>
                </section>
                <section className="flex flex-col border-l border-dashed border-default px-8">
                    {renderData()}
                    <div className="sm:hidden">
                        <Instruction/>
                    </div>
                </section>
            </div>
        </section>
    );
};
