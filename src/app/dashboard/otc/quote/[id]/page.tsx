import React from 'react';

import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import { Divider } from '@nextui-org/divider';

import NextLink from 'next/link';

import { getOtcQuoteById } from '@/actions/dashboard/otc';
import { Icons } from '@/components/icons';
import { subtitle } from '@/components/primitives';
import { TableColumnInterface, YukiTable } from '@/components/ui/YukiTable';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';
import { YukiDateFormat } from '@/lib/misc/DateFormat';
import { OtcOrderInterface, statusColorMap } from '@/lib/zod';

const summaryColumns: TableColumnInterface[] = [
    { key: 'quote_id', type: 'id', label: 'Quote ID' },
    { key: 'market', type: 'text', label: 'Market', options: { uppercase: true } },
    { key: 'side', type: 'side', label: 'Side' },
    { key: 'req_amount', type: 'number', label: 'Requested Amount' },
    { key: 'allotted_amount', type: 'number', label: 'Allotted Amount' },
    { key: 'avg_price', type: 'number', label: 'Average Price' },
    { key: 'quote_status', type: 'status', label: 'Status' },
    { key: 'created_at', type: 'datetime', label: 'Created At' },
    { key: 'expired_at', type: 'datetime', label: 'Expired At' },
];

const orderColumns: TableColumnInterface[] = [
    { key: 'order_id', type: 'id', label: 'Order ID' },
    { key: 'market', type: 'text', label: 'Market', options: { uppercase: true } },
    { key: 'amount', type: 'number', label: 'Amount' },
    { key: 'price', type: 'number', label: 'Price' },
    { key: 'fee', type: 'number', label: 'Fee' },
    { key: 'fee_currency', type: 'currency', label: 'Fee Currency' },
    { key: 'tax', type: 'number', label: 'Tax' },
    { key: 'tax_currency', type: 'currency', label: 'Tax Currency' },
    { key: 'side', type: 'side', label: 'Side' },
    { key: 'order_status', type: 'status', label: 'Status' },
    { key: 'created_at', type: 'datetime', label: 'Created At' },
];

export default async function Page({ params }: { params: { id: string } }) {
    let { data: quoteData, error } = await getOtcQuoteById({ quote_id: params.id });

    if (!quoteData) {
        return (
            <DataPageTemplate error={error}/>
        );
    }

    return (
        <section className="flex h-full grow flex-col">
            <section aria-label="Header" className="mb-4 rounded bg-default-50 p-4 shadow">
                <Button
                    as={NextLink}
                    className="-ml-2 mb-2 text-sm"
                    href="/dashboard/otc/quote"
                    radius="sm"
                    size="sm"
                    variant="flat"
                >
                    <Icons.arrowLeft/>
                    Back
                </Button>
                <div className="flex items-center capitalize">
                    <h1 className={subtitle({ size: 'xl', className: 'mr-4' })}>
                        Quote #{quoteData.quote_id}
                    </h1>
                    <Chip color={statusColorMap[quoteData.quote_status]} size="sm" variant="solid">
                        <span className="text-white">{quoteData.quote_status}</span>
                    </Chip>
                </div>
                <div className="isolate mt-2.5 flex flex-wrap justify-between gap-x-6 gap-y-4 text-medium">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center">
                            <Icons.bank className="text-default-500"/>
                            <span className="ml-2 mr-1 font-semibold">{quoteData.market}</span>
                        </div>
                        <div className="flex items-center">
                            <Icons.arrowRightLeft className="text-default-500"/>
                            <span className="ml-2 mr-1 font-semibold">{quoteData.side}</span>
                        </div>
                        <div className="flex items-center">
                            <Icons.bankNote className="text-default-500"/>
                            <span className="ml-2 mr-1 font-semibold">
                                {quoteData.allotted_amount}
                            </span>
                            <span className="text-sm uppercase text-default-500">USDT @{quoteData.avg_price}</span>
                        </div>
                        <div className="flex items-center font-semibold">
                            <Icons.calendar className="mr-2 text-default-500"/>
                            <YukiDateFormat date={quoteData.created_at} format="fullDateWithZone"/>
                        </div>
                    </div>
                </div>
            </section>
            <section aria-label="data" className="overflow-y-auto">
                <div className="mt-4">
                    <h2 className={subtitle()}>Summary</h2>
                    <Divider className="mt-4"/>
                    <YukiTable asDataTable={true} columns={summaryColumns} tableData={[quoteData]}/>
                </div>
                <div className="mt-8">
                    <h2 className={subtitle()}>Order Details</h2>
                    <Divider className="mt-4"/>
                    <dl className="grid grid-cols-1 text-base/6 font-medium sm:grid-cols-6 sm:text-sm/6">
                        <dt className="col-span-2 border-b border-default-200 py-2.5 text-default-500">
                            Number of Order/s
                        </dt>
                        <dd className="col-span-4 border-b border-default-200 py-2.5">{quoteData.otc_orders.length}</dd>
                    </dl>
                    {quoteData.otc_orders.map((otcOrder: OtcOrderInterface) => {
                        return (
                            <YukiTable
                                key={otcOrder.order_id}
                                asDataTable={true}
                                columns={orderColumns}
                                tableData={[otcOrder]}
                            />
                        );
                    })}
                </div>
            </section>

        </section>
    );
}
