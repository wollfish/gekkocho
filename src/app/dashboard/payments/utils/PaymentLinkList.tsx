'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Chip, ChipProps } from '@nextui-org/chip';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { Input } from '@nextui-org/input';
import { useDisclosure } from '@nextui-org/modal';
import { Pagination } from '@nextui-org/pagination';
import { ChevronDownIcon } from '@nextui-org/shared-icons';
import { Selection, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';

import { SlotsToClasses, TableSlots } from '@nextui-org/theme';

import { toast } from 'sonner';

import { PaymentFormModal } from '@/app/dashboard/payments/utils/PaymentFormModal';
import { Icons, SearchIcon } from '@/components/icons';
import { CryptoIcon } from '@/lib/misc/CryptoIcon';
import { capitalize } from '@/lib/utils';
import { PaymentResponseInterface } from '@/lib/zod';

const statusColorMap: Record<string, ChipProps['color']> = {
    active: 'success',
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

const columns: TableColumns[] = [
    { key: 'description', label: 'Name' },
    { key: 'req_amount', label: 'Amount', options: { withCurrency: true, linked_column: 'req_currency' } },
    { key: 'pay_amount', label: 'Payer Amount', options: { withCurrency: true, linked_column: 'pay_currency' } },
    { key: 'state', label: 'State' },
    { key: 'initiated_at', label: 'Created At' },
    { key: 'cta', label: '' },
    { key: 'actions', label: 'Actions' },
];

const pages = 10;

export const PaymentLinkList: React.FC<{ data: PaymentResponseInterface[] }> = (props) => {
    const {
        isOpen: isPaymentFormModalOpen,
        onOpen: onPaymentFormModalOpen,
        onClose: onPaymentFormModalClose,
    } = useDisclosure();

    const [page, setPage] = useState(1);
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

    const renderCell = useCallback((data: PaymentResponseInterface, column: TableColumns) => {
        const cellKey = column.key;
        const cellValue = data[cellKey as keyof PaymentResponseInterface] as string | number | undefined;

        switch (cellKey) {
            case 'name':
            case 'role':
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
                    <Button isIconOnly aria-label="Copy" size="sm" variant="light" onClick={() => onCopy(data.id)}>
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
                    <Dropdown>
                        <DropdownTrigger className="hidden sm:flex">
                            <Button
                                endContent={<ChevronDownIcon className="text-small"/>}
                                size="sm"
                                variant="flat"
                            >
                                Status
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={false}
                            selectedKeys={statusFilter}
                            selectionMode="multiple"
                            onSelectionChange={setStatusFilter}
                        >
                            {statusOptions.map((status) => (
                                <DropdownItem key={status.uid} className="capitalize">
                                    {capitalize(status.name)}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
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
    }, [filterValue, onPaymentFormModalOpen, statusFilter]);

    const bottomContent = React.useMemo(() => {
        return (
            <div
                className="sticky bottom-0 z-10 flex items-center justify-end border-t border-divider p-2 backdrop-blur-md">
                <div className="mr-8 flex items-center gap-4 text-small text-default-500">
                    <label className="flex items-center ">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none"
                            // onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                    <span>Total - {data.length}</span>
                </div>
                <Pagination
                    showControls
                    color="default"
                    page={page}
                    total={pages}
                    variant="light"
                    onChange={setPage}
                />
            </div>
        );
    }, [data.length, page]);

    return (
        <section aria-label="Payment List" className="flex size-full flex-col">
            {topContent}
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
                        <TableRow key={item.reference_id}>
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
            {bottomContent}
            <PaymentFormModal isOpen={isPaymentFormModalOpen} onClose={onPaymentFormModalClose}/>
        </section>
    );
};
