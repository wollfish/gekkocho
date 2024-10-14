'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Chip, ChipProps } from '@nextui-org/chip';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { Input } from '@nextui-org/input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/modal';
import { Pagination } from '@nextui-org/pagination';
import { ChevronDownIcon } from '@nextui-org/shared-icons';
import { Selection, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';

import { SlotsToClasses, TableSlots } from '@nextui-org/theme';

import { PaymentFormModal } from '@/app/dashboard/payments/utils/PaymentFormModal';
import { Icons, SearchIcon } from '@/components/icons';
import { subtitle } from '@/components/primitives';
import { cryptoIcons } from '@/constant';
import { capitalize, cn } from '@/lib/utils';
import { PaymentResponseInterface } from '@/lib/zod';

const statusColorMap: Record<string, ChipProps['color']> = {
    active: 'success',
    confirmed: 'success',
    pending: 'warning',
    vacation: 'warning',
    paused: 'danger',
    failed: 'danger',
};

const statusOptions = [
    { name: 'Active', uid: 'active' },
    { name: 'Paused', uid: 'paused' },
    { name: 'Vacation', uid: 'vacation' },
];

const columns = [
    { key: 'order_id', label: 'ID' },
    { key: 'amount', label: 'Amount' },
    { key: 'currency', label: 'Currency' },
    { key: 'payer_amount', label: 'Payer Amount' },
    { key: 'payer_currency', label: 'Payer Currency' },
    { key: 'network', label: 'Network', options: { capitalize: true } },
    { key: 'confirms', label: 'Confirmations' },
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Created At' },
    { key: 'actions', label: 'Actions' },
];

const pages = 10;
const INITIAL_VISIBLE_COLUMNS = ['order_id', 'amount', 'currency', 'payer_amount', 'payer_currency', 'network', 'confirms', 'status', 'created_at', 'actions'];

export const PaymentList: React.FC<{ data: PaymentResponseInterface[] }> = (props) => {
    const { data } = props;

    const {
        isOpen: isDetailModalOpen,
        onOpen: onDetailModalOpen,
        onClose: onDetailModalClose,
    } = useDisclosure();

    const {
        isOpen: isPaymentFormModalOpen,
        onOpen: onPaymentFormModalOpen,
        onClose: onPaymentFormModalClose,
    } = useDisclosure();

    const [page, setPage] = useState(1);
    const [filterValue, setFilterValue] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState<Selection>('all');
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [selectedRowKey, setSelectedRowKey] = useState<PaymentResponseInterface['uuid']>(null);

    const classNames: SlotsToClasses<TableSlots> = useMemo(() => ({
        base: 'overflow-auto',
        thead: 'backdrop-blur-md [&>tr]:!shadow-none',
        th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
    }), []);

    const onTableRowClick = useCallback((key: PaymentResponseInterface['uuid']) => {
        setSelectedRowKey(key);
        onDetailModalOpen();
    }, [onDetailModalOpen]);

    const selectedPayment = useMemo(() => data.find((row) => row.uuid === selectedRowKey), [data, selectedRowKey]);

    const visibleHeaders = useMemo(() => {
        return visibleColumns === 'all' ? columns : columns.filter((col) => visibleColumns.has(col.key));
    }, [visibleColumns]);

    const renderCell = useCallback((data: PaymentResponseInterface, columnKey: React.Key) => {
        const cellValue = data[columnKey as keyof PaymentResponseInterface] as string | number | undefined;

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
                return (
                    <Chip className="capitalize" color={statusColorMap[data.status]} size="sm" variant="flat">
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
                        onClick={onPaymentFormModalOpen}
                    >
                        Add New
                    </Button>
                </div>
            </div>
        );
    }, [filterValue, onPaymentFormModalOpen, statusFilter, visibleColumns]);

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
                <TableBody items={data}>
                    {(item) => (
                        <TableRow key={item.uuid}>
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
            <Modal
                backdrop="blur"
                classNames={{
                    base: 'backdrop-blur-md dark:bg-default-50/50',
                    body: 'p-4 text-sm text-default-600 ',
                }}
                hideCloseButton={true}
                isDismissable={true}
                isOpen={isDetailModalOpen}
                size="2xl"
                onClose={onDetailModalClose}
            >
                {selectedPayment && <ModalContent>
                    <ModalHeader className={cn('flex items-center justify-between gap-1', {
                        'bg-success-300/40': statusColorMap[selectedPayment.status] === 'success',
                        'bg-danger-300/40': statusColorMap[selectedPayment.status] === 'danger',
                        'bg-warning-300/40': statusColorMap[selectedPayment.status] === 'warning',
                    })}>
                        <h2>Transaction Details <sup>#{selectedPayment.order_id}</sup></h2>
                        <Chip
                            className="capitalize"
                            color={statusColorMap[selectedPayment.status]}
                            size="sm"
                            variant="flat"
                        >
                            {selectedPayment.status}
                        </Chip>
                    </ModalHeader>
                    <ModalBody>
                        <section className="flex flex-col gap-4 md:grid md:grid-cols-2">
                            <div
                                className="divide-y divide-default rounded-xl bg-default-50 shadow-sm backdrop-blur-xl">
                                <div className="px-4 py-2">
                                    <h3 className={subtitle({ size: 'sm' })}>Overview</h3>
                                </div>
                                <div className="p-4">
                                    <p className="flex justify-between">
                                        <span className="text-xs text-default-400">Order ID :</span>
                                        <span>{selectedPayment.order_id}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-xs  text-default-400">Amount :</span>
                                        <span>{selectedPayment.amount} {selectedPayment.currency}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-xs text-default-400">Payer Amount :</span>
                                        <span>{selectedPayment.payment_amount} {selectedPayment.payer_currency}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-xs text-default-400">Status :</span>
                                        <span className={cn(
                                            'capitalize',
                                            {
                                                'text-success-500': statusColorMap[selectedPayment.status] === 'success',
                                                'text-danger-500': statusColorMap[selectedPayment.status] === 'danger',
                                                'text-warning-500': statusColorMap[selectedPayment.status] === 'warning',
                                            }
                                        )}>{selectedPayment.status}</span>
                                    </p>
                                </div>
                            </div>
                            <div
                                className="divide-y divide-default rounded-xl bg-default-50 shadow-sm backdrop-blur-xl">
                                <div className="px-4 py-2">
                                    <h3 className={subtitle({ size: 'sm' })}>Payment Information</h3>
                                </div>
                                <div className="p-4">
                                    <p className="flex justify-between">
                                        <span className="text-xs text-default-400">Currency & Network :</span>
                                        <span className="uppercase">
                                            {selectedPayment.payer_currency} | {selectedPayment.network}
                                        </span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-xs text-default-400">Payment Amount :</span>
                                        <span>{selectedPayment.payment_amount}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-xs text-default-400">Remains Amount :</span>
                                        <span>{selectedPayment.remains_amount}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-xs text-default-400">Fee Amount :</span>
                                        <span>{selectedPayment.fee_amount}</span>
                                    </p>
                                </div>
                            </div>
                            <div
                                className="col-span-2 divide-y divide-default rounded-xl bg-default-50 shadow-sm backdrop-blur-xl">
                                <div className="px-4 py-2">
                                    <h3 className={subtitle({ size: 'sm' })}>Blockchain Data</h3>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between">
                                        <span className="text-xs text-default-400">To Address :</span>
                                        <span className="flex items-center gap-2">
                                            {selectedPayment.address}
                                            {/*<CopyButton text={selectedPayment.address} title="address"/>*/}
                                            <Icons.clipboard/>
                                        </span>
                                    </div>
                                    <p className="flex justify-between">
                                        <span className="text-xs text-default-400">TxID :</span>
                                        <span className="flex items-center gap-2">
                                            {selectedPayment.txid}
                                            <Icons.clipboard/>
                                        </span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-xs  text-default-400">Block :</span>
                                        <span>{selectedPayment.block}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-xs text-default-400">Confirmations :</span>
                                        <span>{selectedPayment.need_confirms} / {selectedPayment.confirms}</span>
                                    </p>
                                </div>
                            </div>
                        </section>
                        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div
                                className="col-span-2 divide-y divide-default rounded-xl bg-default-50 shadow-sm backdrop-blur-xl">
                                <div className="px-4 py-2">
                                    <h3 className={subtitle({ size: 'sm' })}>Additional Information</h3>
                                </div>
                                <div className="p-4">
                                    <p className="flex justify-between">
                                        <span className="text-xs text-default-400">Description :</span>
                                        <span>{selectedPayment.desc}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-xs  text-default-400">Return URL :</span>
                                        <span>{selectedPayment.return_url}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-xs text-default-400">Created At :</span>
                                        <span>{String(selectedPayment.created_at)}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-xs text-default-400">Expires At :</span>
                                        <span>{String(selectedPayment.expired_at)}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-xs text-default-400">UUID :</span>
                                        <span className="flex items-center gap-2">
                                            {selectedPayment.uuid}
                                            <Icons.clipboard/>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </section>
                    </ModalBody>
                    <ModalFooter>
                        {selectedPayment.status === 'pending' &&
                            <div className="flex w-full items-center gap-2 text-sm">
                                <Icons.info color="#F7931A" size={16}/>
                                <p className="mr-auto">Transaction is pending confirmation</p>
                                <Button size="sm" variant="bordered" onClick={onDetailModalClose}>
                                    View on Explorer
                                    <Icons.arrowRight/>
                                </Button>
                            </div>}
                        {selectedPayment.status === 'failed' &&
                            <div className="flex w-full items-center gap-2 text-sm">
                                <Icons.info color="red" size={16}/>
                                <p className="mr-auto">Transaction Failed due to timeout</p>
                                <Button size="sm" variant="bordered" onClick={onDetailModalClose}>
                                    Issue? Raise a ticket
                                    <Icons.bell/>
                                </Button>
                            </div>}
                        {selectedPayment.status === 'confirmed' &&
                            <div className="flex w-full items-center gap-2 text-sm">
                                <Icons.flower color="green" size={16}/>
                                <p className="mr-auto">Transaction Completed</p>
                                <Button size="sm" variant="bordered" onClick={onDetailModalClose}>
                                    Issue? Raise a ticket
                                    <Icons.bell/>
                                </Button>
                            </div>
                        }
                    </ModalFooter>
                </ModalContent>}
            </Modal>
            <PaymentFormModal isOpen={isPaymentFormModalOpen} onClose={onPaymentFormModalClose}/>
        </section>
    );
};
