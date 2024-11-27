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

import { WithdrawFormModal } from '@/app/dashboard/account/utils';
import { Icons, SearchIcon } from '@/components/icons';
import { cryptoIcons } from '@/constant';
import { capitalize, cn } from '@/lib/utils';
import { WithdrawalInterface } from '@/lib/zod';

const statusColorMap: Record<string, ChipProps['color']> = {
    active: 'success',
    accepted: 'success',
    confirmed: 'success',
    pending: 'warning',
    vacation: 'warning',
    paused: 'danger',
    failed: 'danger',
    rejected: 'danger',
};

const statusOptions = [
    { name: 'Accepted', uid: 'accepted' },
    { name: 'Pending', uid: 'pending' },
    { name: 'Rejected', uid: 'rejected' },
];

const columns: { key: keyof WithdrawalInterface | 'actions', label: string, options?: any }[] = [
    { key: 'tid', label: 'Reference Id' },
    { key: 'txid', label: 'Transaction Id' },
    { key: 'currency', label: 'Currency' },
    { key: 'amount', label: 'Amount' },
    { key: 'rid', label: 'Receiver Address' },
    { key: 'confirmations', label: 'Confirmations' },
    { key: 'state', label: 'Status' },
    { key: 'created_at', label: 'Created At' },
    { key: 'actions', label: 'Actions' },
];

const pages = 10;
const INITIAL_VISIBLE_COLUMNS = ['tid', 'txid', 'currency', 'amount', 'rid', 'state', 'created_at', 'actions'];

export const WithdrawList: React.FC<{ data: WithdrawalInterface[] }> = (props) => {

    const {
        isOpen: isDetailModalOpen,
        onOpen: onDetailModalOpen,
        onClose: onDetailModalClose,
    } = useDisclosure();

    const {
        isOpen: isWithdrawFormModalOpen,
        onOpen: onWithdrawFormModalOpen,
        onClose: onWithdrawFormModalClose,
    } = useDisclosure();

    const [page, setPage] = useState(1);
    const [filterValue, setFilterValue] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState<Selection>('all');
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [selectedRowKey, setSelectedRowKey] = useState<WithdrawalInterface['tid']>(null);

    const classNames: SlotsToClasses<TableSlots> = useMemo(() => ({
        base: 'overflow-auto',
        thead: 'backdrop-blur-md [&>tr]:!shadow-none',
        th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
    }), []);

    const onTableRowClick = useCallback((key: WithdrawalInterface['tid']) => {
        setSelectedRowKey(key);
        onDetailModalOpen();
    }, [onDetailModalOpen]);

    const data = useMemo(() => props.data, [props.data]);

    const selectedWithdraw = useMemo(() => data.find((row) => row.tid === selectedRowKey), [data, selectedRowKey]);

    const visibleHeaders = useMemo(() => {
        return visibleColumns === 'all' ? columns : columns.filter((col) => visibleColumns.has(col.key));
    }, [visibleColumns]);

    const renderCell = useCallback((data: WithdrawalInterface, columnKey: React.Key) => {
        const cellValue = data[columnKey as keyof WithdrawalInterface] as string | number | undefined;

        switch (columnKey) {
            case 'name':
            case 'role':
            case 'currency':
            case 'payer_currency':
                const Icon = cryptoIcons[(cellValue as string).toLowerCase() as keyof typeof cryptoIcons];

                return (
                    <span className="uppercase">{Icon ? <Icon.icon fill={Icon.fill} size={24}/> : cellValue}</span>
                );
            case 'status':
            case 'state':
                return (
                    <Chip className="capitalize" color={statusColorMap[data.state]} size="sm" variant="light">
                        {cellValue}
                    </Chip>
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
                return cellValue;
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
                    placeholder="Search by name..."
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
                    <Dropdown>
                        <DropdownTrigger className="hidden sm:flex">
                            <Button
                                endContent={<ChevronDownIcon className="text-small"/>}
                                size="sm"
                                variant="flat"
                            >
                                Columns
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={false}
                            selectedKeys={visibleColumns}
                            selectionMode="multiple"
                            onSelectionChange={setVisibleColumns}
                        >
                            {columns.map((column) => (
                                <DropdownItem key={column.key} className="capitalize">
                                    {capitalize(column.label)}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                    <Button
                        className="bg-foreground text-background"
                        endContent={<Icons.plus/>}
                        size="sm"
                        onClick={onWithdrawFormModalOpen}
                    >
                        Add New
                    </Button>
                </div>
            </div>
        );
    }, [filterValue, onWithdrawFormModalOpen, statusFilter, visibleColumns]);

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
        <section aria-label="Withdraw List" className="flex size-full flex-col">
            {topContent}
            <Table
                isHeaderSticky
                removeWrapper
                aria-label="Example static collection table"
                classNames={classNames}
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                onRowAction={onTableRowClick}
                onSelectionChange={setSelectedKeys}
            >
                <TableHeader columns={visibleHeaders}>
                    {(column) => (
                        <TableColumn
                            key={column.key}
                        >
                            {column.label}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent="No records found" items={data}>
                    {(item) => (
                        <TableRow key={item.tid}>
                            {visibleHeaders.map((columnKey) => (
                                <TableCell
                                    key={columnKey.key}
                                    className={cn({ 'capitalize': columnKey?.options?.capitalize })}>
                                    {renderCell(item, columnKey.key)}
                                </TableCell>
                            ))}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {bottomContent}
            <WithdrawFormModal isOpen={isWithdrawFormModalOpen} onClose={onWithdrawFormModalClose}/>
        </section>
    );
};
