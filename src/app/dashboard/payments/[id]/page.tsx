import React from 'react';

import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import { Divider } from '@nextui-org/divider';
import NextLink from 'next/link';

import { getPaymentInfoPrivate } from '@/actions/dashboard/payment';
import { Icons } from '@/components/icons';
import { subtitle } from '@/components/primitives';
import { TableColumnInterface, YukiTable } from '@/components/ui/YukiTable';
import { fetchData } from '@/lib/api';
import { YukiCopyButton } from '@/lib/misc/CopyButton';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';
import { YukiDateFormat } from '@/lib/misc/DateFormat';
import { statusColorMap } from '@/lib/zod';

const summaryColumns: TableColumnInterface[] = [
    { key: 'reference_id', type: 'id', label: 'Order ID' },
    { key: 'customer_name', type: 'text', label: 'Customer Name' },
    { key: 'description', type: 'text', label: 'Product Name' },
    {
        key: 'req_amount',
        type: 'number',
        label: 'Order Amount',
        options: { withCurrency: true, linked_column: 'req_currency' },
    },
    {
        key: 'pay_amount',
        type: 'number',
        label: 'Payer Amount',
        options: { withCurrency: true, linked_column: 'pay_currency' },
    },
    {
        key: 'received_amount',
        type: 'number',
        label: 'Received Amount',
        options: { withCurrency: true, linked_column: 'pay_currency' },
    },
    { key: 'exchange_rate', type: 'text', label: 'Order Exchange Rate' },
];

const paymentColumns: TableColumnInterface[] = [
    { key: 'id', type: 'id', label: 'Payment ID' },
    { key: 'pay_currency', type: 'currency', label: 'Payer Currency' },
    { key: 'pay_protocol', type: 'text', label: 'Payer Network' },
    {
        key: 'address',
        type: 'address',
        label: 'Payment Address',
        options: { linked_column: 'pay_explorer_address', searchValue: '#{address}' },
    },
    { key: 'expired_at', type: 'datetime', label: 'Expiration' },
];

const customerColumns: TableColumnInterface[] = [
    { key: 'name', type: 'text', label: 'Name' },
    { key: 'email', type: 'text', label: 'Email' },
    { key: 'phone', type: 'text', label: 'Phone' },
    { key: 'address', type: 'text', label: 'Address' },
];

export default async function Page({ params }: { params: { id: string } }) {
    let { data: responseData, error } = await fetchData(() => getPaymentInfoPrivate({ id: params.id }));

    if (!responseData) {
        return (
            <DataPageTemplate error={error}/>
        );
    }

    const data = {
        ...responseData,
        exchange_rate: `1 ${responseData.pay_currency} = ${(+responseData.exchange_rate).toFixed(2)} ${responseData.req_currency}`.toUpperCase(),
        customer_name: responseData.customer?.name,
        received_amount: responseData.deposits?.reduce((total, deposit) => total + parseFloat(deposit.amount), 0),
    };

    return (
        <section className="flex grow flex-col overflow-auto">
            <section aria-label="Header">
                <Button
                    as={NextLink}
                    className="mb-2 text-sm"
                    href="/dashboard/payments/list"
                    radius="sm"
                    size="sm"
                    variant="light"
                >
                    <Icons.arrowLeft/>
                    Payments
                </Button>
                <div className="flex items-center gap-4 capitalize">
                    <h1 className={subtitle({ size: 'xl' })}>
                        Order #{data.id}
                    </h1>
                    <Chip color={statusColorMap[data.state]} size="sm" variant="solid">
                        <span className="text-white">{data.state}</span>
                    </Chip>
                </div>
                <div className="isolate mt-2.5  flex flex-wrap justify-between gap-x-6 gap-y-4 text-medium">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center">
                            <Icons.bankNote className="text-default-500"/>
                            <span className="ml-2 mr-1 font-semibold">
                                {data.req_amount}
                            </span>
                            <span className="text-sm uppercase text-default-500">{data.req_currency}</span>
                        </div>
                        <div className="flex items-center">
                            <Icons.calendar className="mr-2 text-default-500"/>
                            <YukiDateFormat date={data.initiated_at} format="fullDateWithZone"/>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <YukiCopyButton text={data.id}/>
                        <Button className="" size="sm" type="submit">Print Invoice</Button>
                    </div>
                </div>
            </section>
            <div className="mt-8">
                <h2 className={subtitle()}>Summary</h2>
                <Divider className="mt-4"/>
                <YukiTable asDataTable={true} columns={summaryColumns} tableData={[data]}/>
            </div>
            <div className="mt-8">
                <h2 className={subtitle()}>Payment Details</h2>
                <Divider className="mt-4"/>
                <YukiTable asDataTable={true} columns={paymentColumns} tableData={[data]}/>
            </div>
            <div className="mt-8">
                <h2 className={subtitle()}>Deposit Details</h2>
                <Divider className="mt-4"/>
                <dl className="grid grid-cols-1 text-base/6 font-medium sm:grid-cols-6 sm:text-sm/6">
                    <dt className="col-span-2 border-b border-default-200 py-2.5 text-default-500">Number of Deposit/s
                    </dt>
                    <dd className="col-span-4 border-b border-default-200 py-2.5">{data.deposits.length}</dd>
                </dl>
                {data.deposits.map((deposit, index) => {
                    const depositColumns: TableColumnInterface[] = [
                        {
                            key: 'amount',
                            type: 'number',
                            label: `#${index + 1} Deposit Amount`,
                            options: { withCurrency: true, linked_column: 'currency' },
                        },
                        {
                            key: 'txid',
                            type: 'address',
                            label: `#${index + 1} Deposit Transaction ID`,
                            options: { linked_column: 'explorer_transaction', searchValue: '#{txid}' },
                        },
                        { key: 'created_at', type: 'datetime', label: `#${index + 1} Deposit Initiated At` },
                    ];

                    return (
                        <YukiTable key={deposit.id} asDataTable={true} columns={depositColumns} tableData={[deposit]}/>
                    );
                })}
            </div>
            <div className="my-8">
                <h2 className={subtitle()}>Customer Details</h2>
                <Divider className="mt-4"/>
                <YukiTable asDataTable={true} columns={customerColumns} tableData={[data.customer]}/>
            </div>
        </section>
    );
}
