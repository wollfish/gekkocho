'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { useDisclosure } from '@nextui-org/modal';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';

import { SlotsToClasses, TableSlots } from '@nextui-org/theme';

import { WithdrawFormModal } from '@/app/dashboard/account/utils/WithdrawFormModal';
import { Icons } from '@/components/icons';
import { CryptoIcon } from '@/lib/misc/CryptoIcon';
import { AccountResponseInterface } from '@/lib/zod';

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'currency', label: 'Currency' },
    { key: 'balance', label: 'Available Balance' },
    { key: 'locked', label: 'Locked Balance' },
    { key: 'total', label: 'Total Balance' },
    { key: 'estimated', label: 'Est. Balance ($)' },
    { key: 'actions', label: 'Actions' },
];

interface OwnProps {
    accounts: AccountResponseInterface[];
}

export const AccountList: React.FC<OwnProps> = (props) => {
    const { accounts } = props;

    const {
        isOpen: isWithdrawFormModalOpen,
        onOpen: onWithdrawFormModalOpen,
        onClose: onWithdrawFormModalClose,
    } = useDisclosure();

    const [selectedAccount, setSelectedAccount] = useState<AccountResponseInterface['currency']>(null);

    const tableData = useMemo(() => accounts
        .filter((item) => item.wallet_type !== 'p2p')
        .map((item, index) => ({
            ...item,
            id: index + 1,
            balance: item.balance + ' ' + item.currency.toUpperCase(),
            locked: item.locked + ' ' + item.currency.toUpperCase(),
            escrow: item.escrow + ' ' + item.currency.toUpperCase(),
            total: Number(item.balance) + Number(item.locked) + Number(item.escrow) + ' ' + item.currency.toUpperCase(),
            estimated: '00.00' + ' ' + 'USD',
        })), [accounts]);

    const onTableRowClick = useCallback((key: AccountResponseInterface['currency']) => {
        setSelectedAccount(String(key));
        onWithdrawFormModalOpen();
    }, [onWithdrawFormModalOpen]);

    const classNames: SlotsToClasses<TableSlots> = useMemo(() => ({
        base: 'overflow-auto',
        thead: 'backdrop-blur-md [&>tr]:!shadow-none',
        th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
    }), []);

    const renderCell = useCallback((data: AccountResponseInterface, columnKey: React.Key) => {
        const cellValue = data[columnKey as keyof AccountResponseInterface] as string | number | undefined;

        switch (columnKey) {
            case 'name':
            case 'role':
            case 'currency':
                return (
                    <span className="flex items-center gap-2 uppercase">
                        <CryptoIcon code={cellValue as string}/> {cellValue}
                    </span>
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
                                <DropdownItem onClick={() => onTableRowClick(data.currency)}>
                                    Withdraw
                                </DropdownItem>
                                <DropdownItem>Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, [onTableRowClick]);

    return (
        <section aria-label="Account List" className="flex size-full flex-col">
            <Table
                isHeaderSticky
                removeWrapper
                aria-label="Example static collection table"
                classNames={classNames}
                selectionMode="none"
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.key}>
                            {column.label}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent="No data to display" items={tableData}>
                    {(item) => (
                        <TableRow key={item.currency}>
                            {columns.map((columnKey) => (
                                <TableCell key={columnKey.key}>
                                    {renderCell(item, columnKey.key)}
                                </TableCell>
                            ))}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <WithdrawFormModal
                accounts={tableData}
                isOpen={isWithdrawFormModalOpen}
                selectedAccount={selectedAccount}
                onClose={onWithdrawFormModalClose}
            />
        </section>
    );
};
