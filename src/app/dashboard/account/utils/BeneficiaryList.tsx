'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Chip, ChipProps } from '@nextui-org/chip';
import { Divider } from '@nextui-org/divider';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { Input } from '@nextui-org/input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/modal';
import { Pagination } from '@nextui-org/pagination';
import { ChevronDownIcon } from '@nextui-org/shared-icons';
import { Selection, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';

import { SlotsToClasses, TableSlots } from '@nextui-org/theme';

import { BeneficiaryActivationModal, BeneficiaryFormModal } from '@/app/dashboard/account/utils';
import { Icons, SearchIcon } from '@/components/icons';
import { CryptoIcon } from '@/lib/misc/CryptoIcon';
import { capitalize, cn, truncateTo32Chars } from '@/lib/utils';
import { BeneficiaryInterface, CurrencyResponseInterface, PaymentResponseInterface } from '@/lib/zod';

const statusColorMap: Record<string, ChipProps['color']> = {
    active: 'success',
    confirmed: 'success',
    pending: 'warning',
    vacation: 'warning',
    paused: 'danger',
    failed: 'danger',
    inactive: 'danger',
    aml_processing: 'warning',
};

const statusOptions = [
    { name: 'Active', uid: 'active' },
    { name: 'Paused', uid: 'paused' },
    { name: 'Inactive', uid: 'inactive' },
];

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'currency', label: 'Currency' },
    { key: 'name', label: 'Nick Name' },
    { key: 'protocol', label: 'Protocol', options: { capitalize: true } },
    { key: 'address', label: 'Address', options: { trim32: true } },
    { key: 'state', label: 'State' },
    { key: 'created_at', label: 'Created At' },
    { key: 'actions', label: 'Actions' },
];

const pages = 10;
const INITIAL_VISIBLE_COLUMNS = ['id', 'currency', 'name', 'protocol', 'address', 'state', 'created_at', 'actions'];

interface OwnProps {
    beneficiaries: BeneficiaryInterface[];
    currencies: CurrencyResponseInterface[];
}

export const BeneficiaryList: React.FC<OwnProps> = (props) => {
    const {
        isOpen: isDetailModalOpen,
        onOpen: onDetailModalOpen,
        onClose: onDetailModalClose,
    } = useDisclosure();

    const {
        isOpen: isFormModalOpen,
        onOpen: onFormModalOpen,
        onClose: onFormModalClose,
    } = useDisclosure();

    const {
        isOpen: isActivationModalOpen,
        onOpen: onActivationModalOpen,
        onClose: onActivationModalClose,
    } = useDisclosure();

    const [page, setPage] = useState(1);
    const [filterValue, setFilterValue] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState<Selection>('all');
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [selectedRowKey, setSelectedRowKey] = useState<BeneficiaryInterface['id']>(null);

    const classNames: SlotsToClasses<TableSlots> = useMemo(() => ({
        base: 'overflow-auto',
        thead: 'backdrop-blur-md [&>tr]:!shadow-none',
        th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
    }), []);

    const data = useMemo(() => {
        return props.beneficiaries.map((item) => ({
            ...item,
            address: item.data.address,
        }));
    }, [props.beneficiaries]);

    const onTableRowClick = useCallback((key: BeneficiaryInterface['id']) => {
        setSelectedRowKey(String(key));
        onDetailModalOpen();
    }, [onDetailModalOpen]);

    const selectedBeneficiary = useMemo(() => data.find((row) => String(row.id) === selectedRowKey), [data, selectedRowKey]);

    const visibleHeaders = useMemo(() => {
        return visibleColumns === 'all' ? columns : columns.filter((col) => visibleColumns.has(col.key));
    }, [visibleColumns]);

    const renderCell = useCallback((data: PaymentResponseInterface, columnKey: any) => {
        const cellKey = columnKey.key;
        const cellValue = data[cellKey as keyof PaymentResponseInterface] as string | number | undefined;

        switch (cellKey) {
            case 'name':
                return (
                    <span>{cellValue}</span>
                );
            case 'role':
            case 'currency':
            case 'payer_currency':
                return (
                    <span className="uppercase">
                        <CryptoIcon code={cellValue as string} size="24"/>
                    </span>
                );
            case 'state':
            case 'status':
                return (
                    <Chip className="capitalize" color={statusColorMap[cellValue]} size="sm" variant="light">
                        {cellValue}
                    </Chip>
                );
            case 'address':
                return (
                    <span>{!columnKey.options?.trim32 ? cellValue : truncateTo32Chars(String(cellValue))}</span>
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
                        onClick={onFormModalOpen}
                    >
                        Create New Beneficiary
                    </Button>
                </div>
            </div>
        );
    }, [filterValue, onFormModalOpen, statusFilter, visibleColumns]);

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
                onRowAction={onTableRowClick}
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
                        <TableRow key={item.id}>
                            {visibleHeaders.map((columnKey) => (
                                <TableCell
                                    key={columnKey.key}
                                    className={cn({ 'capitalize': columnKey?.options?.capitalize })}>
                                    {renderCell(item, columnKey)}
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
                size="lg"
                onClose={onDetailModalClose}
            >
                {selectedBeneficiary && <ModalContent>
                    <ModalHeader className={cn('flex items-center justify-between gap-1', {
                        'bg-success-300/40': statusColorMap[selectedBeneficiary.state] === 'success',
                        'bg-danger-300/40': statusColorMap[selectedBeneficiary.state] === 'danger',
                        'bg-warning-300/40': statusColorMap[selectedBeneficiary.state] === 'warning',
                    })}>
                        <h2>Beneficiary Details <sup>#{selectedBeneficiary.id}</sup></h2>
                        <Chip
                            className="capitalize"
                            color={statusColorMap[selectedBeneficiary.state]}
                            size="sm"
                            variant="flat"
                        >
                            {selectedBeneficiary.state}
                        </Chip>
                    </ModalHeader>
                    <ModalBody>
                        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="col-span-2 rounded-xl bg-default-50 shadow-sm">
                                <div className="space-y-2 p-4">
                                    <p className="flex justify-between">
                                        <span className="text-xs text-default-400">Nick Name :</span>
                                        <span>{selectedBeneficiary.name}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-xs text-default-400">Currency :</span>
                                        <span className="flex items-center gap-2 uppercase">
                                            <CryptoIcon code={selectedBeneficiary.currency} size={16}/>
                                            {selectedBeneficiary.currency}
                                        </span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-xs text-default-400">Network :</span>
                                        <span>{selectedBeneficiary.protocol}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-xs text-default-400">Created At :</span>
                                        <span>...</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-xs text-default-400">Description :</span>
                                        {selectedBeneficiary.description}
                                    </p>
                                </div>
                                <Divider/>
                                <div className="p-4">
                                    <p className="flex justify-between">
                                        {selectedBeneficiary.address}
                                        <Icons.clipboard/>
                                    </p>
                                </div>
                            </div>
                        </section>
                    </ModalBody>
                    <ModalFooter>
                        {['pending'].includes(selectedBeneficiary.state) &&
                            <div className="flex w-full items-center gap-2 text-sm">
                                <Icons.info color="#F7931A" size={16}/>
                                <p className="mr-auto">Confirmation pending</p>
                                <Button size="sm" variant="bordered" onClick={onActivationModalOpen}>
                                    Confirm
                                    <Icons.arrowRight/>
                                </Button>
                            </div>}
                        {['aml_processing'].includes(selectedBeneficiary.state) &&
                            <div className="flex w-full items-center gap-2 text-sm">
                                <Icons.info color="#F7931A" size={16}/>
                                <p className="mr-auto">Beneficiary is under system review</p>
                                <Button size="sm" variant="bordered" onClick={onDetailModalClose}>
                                    Issue? Raise a ticket
                                    <Icons.bell/>
                                </Button>
                            </div>}
                        {selectedBeneficiary.state === 'inactive' &&
                            <div className="flex w-full items-center gap-2 text-sm">
                                <Icons.info color="red" size={16}/>
                                <p className="mr-auto">Confirmation failed or Inactive</p>
                                <Button size="sm" variant="bordered" onClick={onDetailModalClose}>
                                    Issue? Raise a ticket
                                    <Icons.bell/>
                                </Button>
                            </div>}
                        {selectedBeneficiary.state === 'active' &&
                            <div className="flex w-full items-center gap-2 text-sm">
                                <Icons.flower color="green" size={16}/>
                                <p className="mr-auto">Verified</p>
                                <Button size="sm" variant="bordered" onClick={onDetailModalClose}>
                                    Issue? Raise a ticket
                                    <Icons.bell/>
                                </Button>
                            </div>
                        }
                    </ModalFooter>
                </ModalContent>}
            </Modal>
            <BeneficiaryActivationModal
                beneficiaryId={selectedBeneficiary?.id}
                isOpen={isActivationModalOpen}
                onClose={onActivationModalClose}
            />
            <BeneficiaryFormModal
                currencies={props.currencies}
                isOpen={isFormModalOpen}
                onClose={onFormModalClose}
            />
        </section>
    );
};
