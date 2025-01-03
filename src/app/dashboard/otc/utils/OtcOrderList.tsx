'use client';

import React from 'react';
import { Input } from '@nextui-org/input';

import { SearchIcon } from '@/components/icons';
import { TableColumnInterface, YukiTable } from '@/components/ui/YukiTable';
import { OtcOrderInterface } from '@/lib/zod';

const columns: TableColumnInterface[] = [
    { key: 'order_id', type: 'id', label: 'Order ID' },
    { key: 'market', type: 'text', label: 'Market', options: { uppercase: true } },
    { key: 'side', type: 'side', label: 'Side' },
    { key: 'amount', type: 'number', label: 'Amount', options: { withCurrency: true, linked_column: 'fee_currency' } },
    { key: 'price', type: 'number', label: 'Price', options: { withCurrency: true, linked_column: 'fee_currency' } },
    { key: 'fee', type: 'number', label: 'Fee', options: { withCurrency: true, linked_column: 'fee_currency' } },
    { key: 'tax', type: 'number', label: 'Tax', options: { withCurrency: true, linked_column: 'tax_currency' } },
    { key: 'order_status', type: 'status', label: 'Status' },
    { key: 'created_at', type: 'datetime', label: 'Created At' },
];

export const OtcOrderList: React.FC<{ data: OtcOrderInterface[] }> = (props) => {
    const [filterValue, setFilterValue] = React.useState('');

    const data = React.useMemo(() => {
        return props.data.filter((item) => String(item.order_id).toLowerCase().includes(filterValue.toLowerCase()));
    }, [filterValue, props.data]);

    const topContent = React.useMemo(() => {
        return (
            <div className="mb-4 flex items-end justify-between gap-4">
                <Input
                    isClearable
                    classNames={{
                        base: 'w-full sm:max-w-[44%]',
                        inputWrapper: 'border-1',
                    }}
                    placeholder="Search by id..."
                    size="sm"
                    startContent={<SearchIcon className="text-default-300"/>}
                    value={filterValue}
                    variant="bordered"
                    onClear={() => setFilterValue('')}
                    onValueChange={(value) => setFilterValue(value)}
                />
            </div>
        );
    }, [filterValue]);

    return (
        <YukiTable
            columns={columns}
            mainKey="order_id"
            tableData={data}
            topComponent={topContent}
        />
    );
};
