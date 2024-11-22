'use client';

import React, { useCallback, useMemo } from 'react';
import { Button } from '@nextui-org/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';

import { SlotsToClasses, TableSlots } from '@nextui-org/theme';

import { Icons } from '@/components/icons';
import { cryptoIcons } from '@/constant';
import { WalletResponseInterface } from '@/lib/zod';

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'currency', label: 'Currency' },
    { key: 'balance', label: 'Available Balance' },
    { key: 'locked', label: 'Locked Balance' },
    { key: 'escrow', label: 'Escrow Balance' },
    { key: 'total', label: 'Total Balance' },
    { key: 'estimated', label: 'Est. Balance ($)' },
    { key: 'actions', label: 'Actions' },
];

export const WalletList: React.FC<{ data: WalletResponseInterface[] }> = (props) => {
    const { data } = props;

    const tableData = useMemo(() => data.map((item, index) => ({
        ...item,
        id: index + 1,
        balance: item.balance + ' ' + item.currency.toUpperCase(),
        locked: item.locked + ' ' + item.currency.toUpperCase(),
        escrow: item.escrow + ' ' + item.currency.toUpperCase(),
        total: Number(item.balance) + Number(item.locked) + Number(item.escrow) + ' ' + item.currency.toUpperCase(),
        estimated: '00.00' + ' ' + 'USD',
    })), [data]);

    const classNames: SlotsToClasses<TableSlots> = useMemo(() => ({
        base: 'overflow-auto',
        thead: 'backdrop-blur-md [&>tr]:!shadow-none',
        th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
    }), []);

    const renderCell = useCallback((data: WalletResponseInterface, columnKey: React.Key) => {
        const cellValue = data[columnKey as keyof WalletResponseInterface] as string | number | undefined;

        switch (columnKey) {
            case 'name':
            case 'role':
            case 'currency':
            case 'payer_currency':
                const Icon = cryptoIcons[(cellValue as string).toLowerCase() as keyof typeof cryptoIcons];

                return (
                    <span className="flex items-center gap-2 uppercase">
                        {Icon && <Icon.icon fill={Icon.fill} size={24}/>}
                        {cellValue}
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
                                <DropdownItem>Withdraw</DropdownItem>
                                <DropdownItem>Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <section aria-label="Wallet List" className="flex size-full flex-col">
            <Table
                isHeaderSticky
                removeWrapper
                aria-label="Example static collection table"
                classNames={classNames}
                selectionMode="none"
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.key}
                        >
                            {column.label}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={tableData}>
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
        </section>
    );
};
