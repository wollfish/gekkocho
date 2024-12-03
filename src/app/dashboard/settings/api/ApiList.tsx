'use client';

import React, { useCallback, useMemo } from 'react';
import { Button } from '@nextui-org/button';
import { Chip, ChipProps } from '@nextui-org/chip';
import { useDisclosure } from '@nextui-org/modal';
import { Switch } from '@nextui-org/switch';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';

import { SlotsToClasses, TableSlots } from '@nextui-org/theme';

import { ApiKeyFormModal } from '@/app/dashboard/settings/api/ApiKeyFormModal';
import { Icons } from '@/components/icons';
import { CryptoIcon } from '@/lib/misc/CryptoIcon';
import { truncateTo32Chars } from '@/lib/utils';
import { ApiKeyResponseInterface } from '@/lib/zod';

const statusColorMap: Record<string, ChipProps['color']> = {
    active: 'success',
    disabled: 'danger',
    inactive: 'danger',
};

const columns = [
    { key: 'kid', label: 'Key ID' },
    { key: 'algorithm', label: 'Algorithm' },
    { key: 'state', label: 'State' },
    { key: 'switch', label: '' },
    { key: 'created_at', label: 'Created At' },
    { key: 'updated_at', label: 'Updated At' },
    { key: 'actions', label: 'Actions' },
];

interface OwnProps {
    apiKeys: ApiKeyResponseInterface[];
}

export const ApiList: React.FC<OwnProps> = (props) => {
    const {
        isOpen: isCreateModalOpen,
        onOpen: onCreateModalOpen,
        onClose: onCreateModalClose,
    } = useDisclosure();
    const [action, setAction] = React.useState<'create' | 'update' | 'delete'>(null);
    const [kid, setKid] = React.useState<string>('');

    const classNames: SlotsToClasses<TableSlots> = useMemo(() => ({
        base: 'overflow-auto',
        thead: 'backdrop-blur-md [&>tr]:!shadow-none',
        th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
    }), []);

    const onGenerateKey = useCallback(() => {
        setAction('create');
        onCreateModalOpen();
    }, [onCreateModalOpen]);

    const onUpdateKey = useCallback((kid: string) => {
        setAction('update');
        setKid(kid);
        onCreateModalOpen();
    }, [onCreateModalOpen]);

    const onDeleteKey = useCallback((kid: string) => {
        setAction('delete');
        setKid(kid);
        onCreateModalOpen();
    }, [onCreateModalOpen]);

    const onClose = useCallback(() => {
        setAction(null);
        setKid('');
        onCreateModalClose();
    }, [onCreateModalClose]);

    const data = useMemo(() => props.apiKeys, [props.apiKeys]);
    const selectedApiKey = useMemo(() => data.find((apiKey) => apiKey.kid === kid), [data, kid]);

    const renderCell = useCallback((data: ApiKeyResponseInterface, columnKey: any) => {
        const cellKey = columnKey.key;
        const cellValue = data[cellKey as keyof ApiKeyResponseInterface] as string | number | undefined;

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
                    <Chip className="p-0 capitalize" color={statusColorMap[cellValue]} size="sm" variant="light">
                        {cellValue}
                    </Chip>
                );
            case 'address':
                return (
                    <span>{!columnKey.options?.trim32 ? cellValue : truncateTo32Chars(String(cellValue))}</span>
                );

            case 'switch':
                return (
                    <Switch
                        isSelected={data?.state === 'active'}
                        size="sm"
                        onChange={() => onUpdateKey(data.kid)}
                    />
                );
            case 'actions':
                return (
                    <Button isIconOnly size="sm" variant="light" onClick={() => onDeleteKey(data.kid)}>
                        <Icons.trash className="text-danger" size={16}/>
                    </Button>
                );
            default:
                return cellValue;
        }
    }, [onDeleteKey, onUpdateKey]);

    const topContent = React.useMemo(() => {
        return (
            <div className="mb-4 flex items-end justify-between gap-4">
                <div/>
                <div className="flex gap-3">
                    <Button
                        className="bg-foreground text-background"
                        endContent={<Icons.plus/>}
                        size="sm"
                        onClick={onGenerateKey}
                    >
                        Generate New API Key
                    </Button>
                </div>
            </div>
        );
    }, [onGenerateKey]);

    return (
        <section aria-label="Payment List" className="flex size-full flex-col">
            {topContent}
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
                <TableBody emptyContent="No records found" items={data}>
                    {(item) => (
                        <TableRow key={item.kid}>
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
            <ApiKeyFormModal
                action={action}
                isOpen={isCreateModalOpen}
                selectedApiKey={selectedApiKey}
                onClose={onClose}
            />
        </section>
    );
};
