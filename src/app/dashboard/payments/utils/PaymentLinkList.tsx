'use client';

import React, { useMemo } from 'react';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { useDisclosure } from '@nextui-org/modal';

import { toast } from 'sonner';

import { PaymentFormModal } from '@/app/dashboard/payments/utils/PaymentFormModal';
import { Icons, SearchIcon } from '@/components/icons';
import { TableColumnInterface, YukiTable } from '@/components/ui/YukiTable';
import { PaymentResponseInterface } from '@/lib/zod';

const columns: TableColumnInterface[] = [
    { key: 'description', type: 'text', label: 'Name' },
    {
        key: 'req_amount',
        type: 'number',
        label: 'Amount',
        options: { withCurrency: true, linked_column: 'req_currency' },
    },
    {
        key: 'pay_amount',
        type: 'number',
        label: 'Payer Amount',
        options: { withCurrency: true, linked_column: 'pay_currency' },
    },
    { key: 'state', type: 'status', label: 'Status' },
    { key: 'initiated_at', type: 'datetime', label: 'Created At' },
    { key: '', type: 'action', label: 'Actions' },
];

export const PaymentLinkList: React.FC<{ data: PaymentResponseInterface[] }> = (props) => {
    const {
        isOpen: isPaymentFormModalOpen,
        onOpen: onPaymentFormModalOpen,
        onClose: onPaymentFormModalClose,
    } = useDisclosure();

    const [filterValue, setFilterValue] = React.useState('');

    const onCopy = (value: PaymentResponseInterface) => {
        navigator.clipboard.writeText(`${window.location.origin}/pay/${value.id}`).then(() => {
            toast.success('Payment link Copied to clipboard');
        }).catch(() => {
            toast.error('Failed to copy to payment link');
        });
    };

    const data = useMemo(() => {
        return props.data.filter((row) => ['processing', 'pending'].includes(row.state)).filter((row) => row.reference_id.includes(filterValue));
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
                tableData={data}
                topComponent={topContent}
                onCopyClick={onCopy}
            />
            <PaymentFormModal isOpen={isPaymentFormModalOpen} onClose={onPaymentFormModalClose}/>
        </React.Fragment>
    );
};
