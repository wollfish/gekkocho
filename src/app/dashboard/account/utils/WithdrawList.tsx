'use client';

import React from 'react';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { useDisclosure } from '@nextui-org/modal';

import { SearchIcon } from '@nextui-org/shared-icons';

import { WithdrawFormModal } from '@/app/dashboard/account/utils/WithdrawFormModal';
import { Icons } from '@/components/icons';
import { TableColumnInterface, YukiTable } from '@/components/ui/YukiTable';
import { AccountResponseInterface, WithdrawalInterface } from '@/lib/zod';

const columns: TableColumnInterface[] = [
    { key: 'tid', type: 'id', label: 'Reference Id' },
    {
        key: 'txid',
        type: 'address',
        label: 'Transaction Id',
        options: {
            linked_column: 'explorer_transaction',
            searchValue: '#{txid}',
            truncate: { length: 24, direction: 'middle' },
        },
    },
    { key: 'currency', type: 'currency', label: 'Currency' },
    { key: 'amount', type: 'number', label: 'Amount', options: { withCurrency: true, linked_column: 'currency' } },
    {
        key: 'rid',
        type: 'address',
        label: 'Receiver Address',
        options: {
            linked_column: 'explorer_address',
            searchValue: '#{address}',
            truncate: { length: 24, direction: 'middle' },
        },
    },
    { key: 'confirmations', type: 'text', label: 'Confirmations' },
    { key: 'state', type: 'status', label: 'Status' },
    { key: 'created_at', type: 'datetime', label: 'Created At' },
];

interface OwnProps {
    withdrawals: WithdrawalInterface[];
    accounts: AccountResponseInterface[]
}

export const WithdrawList: React.FC<OwnProps> = (props) => {
    const {
        isOpen: isWithdrawFormModalOpen,
        onOpen: onWithdrawFormModalOpen,
        onClose: onWithdrawFormModalClose,
    } = useDisclosure();

    const [filterValue, setFilterValue] = React.useState('');

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
                        onClick={onWithdrawFormModalOpen}
                    >
                        Create New Withdrawal
                    </Button>
                </div>
            </div>
        );
    }, [filterValue, onWithdrawFormModalOpen]);

    return (
        <React.Fragment>
            <YukiTable
                columns={columns}
                tableData={props.withdrawals}
                topComponent={topContent}
            />
            <WithdrawFormModal
                accounts={props.accounts || []}
                isOpen={isWithdrawFormModalOpen}
                onClose={onWithdrawFormModalClose}
            />
        </React.Fragment>
    );
};
