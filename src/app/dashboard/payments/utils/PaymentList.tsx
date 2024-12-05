'use client';

import React, { useCallback, useMemo } from 'react';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { useDisclosure } from '@nextui-org/modal';

import { PaymentFormModal } from '@/app/dashboard/payments/utils/PaymentFormModal';
import { Icons, SearchIcon } from '@/components/icons';
import { TableColumnInterface, YukiTable } from '@/components/ui/YukiTable';
import { PaymentResponseInterface } from '@/lib/zod';

const columns: TableColumnInterface[] = [
    { key: 'id', type: 'id', label: 'Payment ID' },
    { key: 'reference_id', type: 'id', label: 'Order Id' },
    {
        key: 'req_amount',
        type: 'number',
        label: 'Request Amount',
        options: { withCurrency: true, linked_column: 'req_currency' },
    },
    {
        key: 'pay_amount',
        type: 'number',
        label: 'Payer Amount',
        options: { withCurrency: true, linked_column: 'pay_currency' },
    },
    { key: 'pay_currency', type: 'currency', label: 'Payer Currency' },
    { key: 'pay_protocol', type: 'text', label: 'Network', options: { capitalize: true } },
    { key: 'state', type: 'status', label: 'Status' },
    { key: 'initiated_at', type: 'datetime', label: 'Created At' },
];

export const PaymentList: React.FC<{ data: PaymentResponseInterface[] }> = (props) => {
    const {
        isOpen: isPaymentFormModalOpen,
        onOpen: onPaymentFormModalOpen,
        onClose: onPaymentFormModalClose,
    } = useDisclosure();

    const [filterValue, setFilterValue] = React.useState('');

    const data = useMemo(() => {
        const data: PaymentResponseInterface[] = props.data.map((row) => {
            return {
                ...row,
            };
        });

        if (filterValue) {
            return data.filter((row) => row.reference_id.includes(filterValue));
        }

        return data;
    }, [filterValue, props.data]);

    const onTableRowClick = useCallback((key: PaymentResponseInterface['id']) => {
        window.open(`${window.location.origin}/dashboard/payments/${key}`, '_self');
    }, []);

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
                <div className="flex gap-3">
                    <Button
                        className="bg-foreground text-background"
                        endContent={<Icons.plus/>}
                        size="sm"
                        onClick={onPaymentFormModalOpen}
                    >
                        Create New Payment Link
                    </Button>
                </div>
            </div>
        );
    }, [filterValue, onPaymentFormModalOpen]);

    return (
        <React.Fragment>
            <YukiTable
                columns={columns}
                mainKey="id"
                tableData={data}
                topComponent={topContent}
                onTableRowClick={onTableRowClick}
            />
            <PaymentFormModal isOpen={isPaymentFormModalOpen} onClose={onPaymentFormModalClose}/>
        </React.Fragment>
    );
};
