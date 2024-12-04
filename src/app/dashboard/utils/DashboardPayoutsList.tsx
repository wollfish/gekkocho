'use client';

import React, { useCallback, useMemo } from 'react';
import { Button } from '@nextui-org/button';
import { Chip, ChipProps } from '@nextui-org/chip';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { useDisclosure } from '@nextui-org/modal';
import { Selection, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';

import { SlotsToClasses, TableSlots } from '@nextui-org/theme';

import { toast } from 'sonner';

import { PaymentFormModal } from '@/app/dashboard/payments/utils/PaymentFormModal';
import { Icons } from '@/components/icons';
import { CryptoIcon } from '@/lib/misc/CryptoIcon';
import { WithdrawalInterface } from '@/lib/zod';

const statusColorMap: Record<string, ChipProps['color']> = {
    active: 'success',
    accepted: 'success',
    confirmed: 'success',
    pending: 'warning',
    processing: 'warning',
    vacation: 'warning',
    paused: 'danger',
    failed: 'danger',
    rejected: 'danger',
};

const statusOptions = [
    { name: 'Active', uid: 'active' },
    { name: 'Paused', uid: 'paused' },
    { name: 'Vacation', uid: 'vacation' },
];

type TableColumns = {
    key: string;
    label: string;
    options?: {
        withCurrency?: boolean;
        linked_column?: string;
        capitalize?: boolean;
    };
};

// const columns: { key: keyof WithdrawalInterface | 'actions', label: string, options?: any }[] = [
//     { key: 'tid', label: 'Reference Id' },
//     { key: 'txid', label: 'Transaction Id' },
//     { key: 'currency', label: 'Currency' },
//     { key: 'amount', label: 'Amount' },
//     { key: 'rid', label: 'Receiver Address' },
//     { key: 'confirmations', label: 'Confirmations' },
//     { key: 'state', label: 'Status' },
//     { key: 'created_at', label: 'Created At' },
//     { key: 'actions', label: 'Actions' },
// ];

const columns: TableColumns[] = [
    { key: 'tid', label: 'Reference Id' },
    { key: 'txid', label: 'Transaction Id' },
    { key: 'amount', label: 'Amount', options: { withCurrency: true, linked_column: 'currency' } },
    { key: 'state', label: 'State' },
    { key: 'created_at', label: 'Created At' },
    // { key: 'cta', label: '' },
    // { key: 'actions', label: 'Actions' },
];

export const DashboardPayoutsList: React.FC<{ data: WithdrawalInterface[] }> = (props) => {
    const {
        isOpen: isPaymentFormModalOpen,
        onOpen: onPaymentFormModalOpen,
        onClose: onPaymentFormModalClose,
    } = useDisclosure();

    const [filterValue, setFilterValue] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState<Selection>('all');

    const onCopy = (value: string) => {
        navigator.clipboard.writeText(`https://pay.coinfinacle.com/pay/${value}`).then(() => {
            toast.success('Copied to clipboard');
        }).catch(() => {
            toast.error('Failed to copy to clipboard');
        });
    };

    const classNames: SlotsToClasses<TableSlots> = useMemo(() => ({
        base: 'overflow-auto',
        thead: 'backdrop-blur-md [&>tr]:!shadow-none',
        th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
    }), []);

    const data = useMemo(() => {
        const data: WithdrawalInterface[] = props.data.map((row) => {
            return {
                ...row,
            };
        });

        if (filterValue) {
            return data.filter((row) => row.rid.includes(filterValue));
        }

        return data;
    }, [filterValue, props.data]);

    const renderCell = useCallback((data: WithdrawalInterface, column: TableColumns) => {
        const cellKey = column.key;
        const cellValue = data[cellKey as keyof WithdrawalInterface] as string | number | undefined;

        switch (cellKey) {
            case 'name':
            case 'role':
            case 'amount':
            case 'req_amount':
            case 'pay_amount':
                return (
                    <span className="flex items-baseline gap-1">
                        {cellValue || '-'}
                        <span className="text-xs uppercase text-default-400">
                            {column.options?.withCurrency && data[column.options.linked_column]}
                        </span>
                    </span>
                );
            case 'currency':
            case 'pay_currency':
            case 'req_currency':
                return (
                    <span className="flex items-center gap-2 uppercase">
                        <CryptoIcon code={cellValue as string} size={16}/> {cellValue}
                    </span>
                );
            case 'status':
            case 'state':
                return (
                    <Chip className="capitalize" color={statusColorMap[data.state]} size="sm" variant="light">
                        {cellValue}
                    </Chip>
                );
            case 'cta':
                return (
                    <Button isIconOnly aria-label="Copy" size="sm" variant="light" onClick={() => onCopy(data.rid)}>
                        <Icons.copy className="text-default-400" size={16}/>
                    </Button>
                );
            case 'actions':
                return (
                    <div className="relative flex items-center gap-2">
                        <Dropdown
                            classNames={{
                                content: 'backdrop-blur-md bg-default-50/50',
                            }}
                        >
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <Icons.ellipseH className="text-default-400" size={16}/>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem>View</DropdownItem>
                                <DropdownItem>Edit</DropdownItem>
                                <DropdownItem>Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue || '-';
        }
    }, []);

    return (
        <section aria-label="Payment List" className="flex size-full flex-col">
            <Table
                isHeaderSticky
                removeWrapper
                aria-label="Example static collection table"
                classNames={classNames}
                selectionMode="none"
                onRowAction={() => undefined}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.key}>
                            {column.label}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent="No rows to display." items={data}>
                    {(item) => (
                        <TableRow key={item.rid}>
                            {columns.map((columnKey) => (
                                <TableCell
                                    key={columnKey.key}
                                >
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            ))}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {data.length > 5 && <p className="mb-4 text-center text-sm text-default-400 underline">View More</p>}
            <PaymentFormModal isOpen={isPaymentFormModalOpen} onClose={onPaymentFormModalClose}/>
        </section>
    );
};
