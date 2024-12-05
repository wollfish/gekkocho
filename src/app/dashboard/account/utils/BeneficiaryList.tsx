'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Chip, ChipProps } from '@nextui-org/chip';
import { Divider } from '@nextui-org/divider';
import { Input } from '@nextui-org/input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/modal';

import { BeneficiaryActivationModal, BeneficiaryFormModal } from '@/app/dashboard/account/utils';
import { Icons, SearchIcon } from '@/components/icons';
import { TableColumnInterface, YukiTable } from '@/components/ui/YukiTable';
import { CryptoIcon } from '@/lib/misc/CryptoIcon';
import { cn } from '@/lib/utils';
import { BeneficiaryInterface, CurrencyResponseInterface } from '@/lib/zod';

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

const columns: TableColumnInterface[] = [
    { key: 'id', type: 'id', label: 'ID' },
    { key: 'currency', type: 'currency', label: 'Currency' },
    { key: 'name', type: 'text', label: 'Nick Name' },
    { key: 'protocol', type: 'text', label: 'Protocol', options: { capitalize: true } },
    {
        key: 'address',
        type: 'address',
        label: 'Address',
        options: {
            linked_column: 'explorer_address',
            searchValue: '#{address}',
            truncate: { length: 24, direction: 'middle' },
        },
    },
    { key: 'state', type: 'status', label: 'State' },
    { key: 'created_at', type: 'datetime', label: 'Created At' },
    { key: '', type: 'action', label: 'Actions' },
];

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

    const [filterValue, setFilterValue] = React.useState('');
    const [selectedRowKey, setSelectedRowKey] = useState<BeneficiaryInterface['id']>(null);
    
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
                    <Button
                        className="bg-foreground text-background"
                        endContent={<Icons.plus/>}
                        size="sm"
                        onClick={onFormModalOpen}
                    >
                        Add New Beneficiary
                    </Button>
                </div>
            </div>
        );
    }, [filterValue, onFormModalOpen]);

    return (
        <React.Fragment>
            <YukiTable
                columns={columns}
                tableData={data}
                topComponent={topContent}
                onDeleteClick={() => undefined}
                onTableRowClick={onTableRowClick}
            />
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
        </React.Fragment>
    );
};
