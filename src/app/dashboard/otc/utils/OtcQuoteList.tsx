'use client';

import React, { useCallback } from 'react';
import { Input } from '@nextui-org/input';

import { useRouter } from 'next/navigation';

import { SearchIcon } from '@/components/icons';
import { TableColumnInterface, YukiTable } from '@/components/ui/YukiTable';
import { OtcQuoteInterface } from '@/lib/zod';

const columns: TableColumnInterface[] = [
    { key: 'quote_id', type: 'id', label: 'Quote ID' },
    { key: 'market', type: 'text', label: 'Market', options: { uppercase: true } },
    { key: 'side', type: 'side', label: 'Side' },
    { key: 'req_amount', type: 'number', label: 'Requested Amount' },
    { key: 'allotted_amount', type: 'number', label: 'Allotted Amount' },
    { key: 'avg_price', type: 'number', label: 'Average Price' },
    { key: 'quote_status', type: 'status', label: 'Status' },
    { key: 'created_at', type: 'datetime', label: 'Created At' },
];

export const OtcQuoteList: React.FC<{ data: OtcQuoteInterface[] }> = (props) => {
    const [filterValue, setFilterValue] = React.useState('');

    const router = useRouter();

    const data = React.useMemo(() => {
        return props.data.filter((item) => String(item.quote_id).toLowerCase().includes(filterValue.toLowerCase()));
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

    const onTableRowClick = useCallback((key: OtcQuoteInterface['quote_id']) => {
        router.push(`/dashboard/otc/quote/${key}`);
    }, [router]);

    return (
        <YukiTable
            columns={columns}
            mainKey="quote_id"
            tableData={data}
            topComponent={topContent}
            onTableRowClick={onTableRowClick}
        />
    );
};
