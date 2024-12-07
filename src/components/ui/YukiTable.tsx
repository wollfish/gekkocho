'use client';

import React, { useCallback, useMemo } from 'react';

import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import { Pagination } from '@nextui-org/pagination';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { SlotsToClasses, TableSlots } from '@nextui-org/theme';

import { Icons } from '@/components/icons';
import { localeDate } from '@/lib/localeDate';
import { CryptoIcon } from '@/lib/misc/CryptoIcon';
import { truncateText } from '@/lib/utils';
import { statusColorMap } from '@/lib/zod';

export const TableColumnTypeInterface = ['index', 'action', 'currency', 'date', 'datetime', 'email', 'address', 'id', 'link', 'number', 'status', 'text', 'cta'] as const;

export type TableColumnInterface = {
    key: string;
    type: typeof TableColumnTypeInterface[number]
    label: string;
    options?: {
        withCurrency?: boolean;
        linked_column?: string;
        capitalize?: boolean;
        searchValue?: string;
        truncate?: { length: number, direction: 'end' | 'middle' }
    };
};

type PaginationProps = {
    showPagination?: boolean;
    total?: number;
    rowPerPage?: number;
    currentPage?: number;
    onRowPerPageChange?: (value: string) => void;
    onPageChange?: (page: number) => void;
};

export interface OwnProps extends PaginationProps {
    columns: TableColumnInterface[];
    mainKey?: string;
    tableData: any[];
    topComponent?: React.ReactNode;
    bottomComponent?: React.ReactNode;
    asDataTable?: boolean;

    onCopyClick?: (data: any) => void;
    onEditClick?: (data: any) => void;
    onLinkClick?: (data: any) => void;
    onDeleteClick?: (data: any) => void;
    onTableRowClick?: (data: any) => void;
}

export const YukiTable: React.FC<OwnProps> = (props) => {
    const {
        mainKey = 'id',
        columns,
        tableData,
        topComponent,
        bottomComponent,

        currentPage,
        rowPerPage,
        showPagination,
        total,
        asDataTable,

        onDeleteClick,
        onCopyClick,
        onLinkClick,
        onEditClick,
        onTableRowClick,
        onRowPerPageChange,
        onPageChange,
    } = props;

    const classNames: SlotsToClasses<TableSlots> = useMemo(() => ({
        base: 'overflow-auto',
        thead: 'backdrop-blur-md [&>tr]:!shadow-none',
        th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
    }), []);

    const renderCell = useCallback((data: any, column: TableColumnInterface) => {
        const cellValue = data[column.key];
        const truncateOptions = column?.options?.truncate;
        const linkedColumn = column?.options?.linked_column;
        const searchValue = column?.options?.searchValue;
        const truncatedText = truncateOptions ? truncateText(cellValue, truncateOptions.length, truncateOptions.direction) : cellValue;

        switch (column.type) {
            case 'id':
                return (
                    <span className="font-medium">{cellValue}</span>
                );
            case 'number':
                return (
                    <span className="flex items-baseline gap-1">
                        {cellValue}
                        <span className="text-xs uppercase text-default-500">
                            {column.options?.withCurrency && data[linkedColumn]}
                        </span>
                    </span>
                );
            case 'currency':
                return (
                    <span className="flex items-center gap-2 uppercase">
                        <CryptoIcon code={cellValue as string} size={20}/> {cellValue}
                    </span>
                );
            case 'status':
                return (
                    <Chip className="capitalize" color={statusColorMap[data.state]} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            case 'datetime':
                return (
                    <span>{localeDate(cellValue, 'fullDateWithZone')}</span>
                );
            case 'text':
                return (
                    <span title={cellValue}>{truncatedText}</span>
                );
            case 'address':
                if (!linkedColumn || !data[linkedColumn]) return cellValue;

                const href = data[linkedColumn].replace(searchValue, cellValue);

                return (
                    <a className="text-primary underline" href={href} target="_blank" title={cellValue}>
                        {truncatedText}
                    </a>
                );

            case 'action':
                return (
                    <div className="flex items-center gap-2">
                        {onCopyClick && <Button
                            aria-label="Copy"
                            isIconOnly={true}
                            size="sm"
                            title="Copy"
                            variant="light"
                            onClick={() => onCopyClick(data)}
                        >
                            <Icons.clipboard className="text-default-500" size={16}/>
                        </Button>}
                        {onLinkClick && <Button
                            aria-label="Link"
                            isIconOnly={true}
                            size="sm"
                            variant="light"
                            onClick={() => onLinkClick(data)}
                        >
                            <Icons.link className="text-blue-500" size={16}/>
                        </Button>}
                        {onEditClick && <Button
                            aria-label="Edit"
                            isIconOnly={true}
                            size="sm"
                            variant="light"
                            onClick={() => onEditClick(data)}
                        >
                            <Icons.plus className="text-default-500" size={16}/>
                        </Button>}
                        {onDeleteClick && <Button
                            aria-label="Delete"
                            isIconOnly={true}
                            size="sm"
                            variant="light"
                            onClick={() => onDeleteClick(data)}
                        >
                            <Icons.trash className="text-danger" size={16}/>
                        </Button>}
                    </div>
                );
            default:
                return cellValue;
        }
    }, [onCopyClick, onDeleteClick, onEditClick, onLinkClick]);

    const bottomContent = React.useMemo(() => {
        if (!showPagination) return null;

        return (
            <div
                className="sticky bottom-0 z-10 flex items-center justify-end border-t border-divider p-2 backdrop-blur-md">
                <div className="mr-8 flex items-center gap-4 text-small text-default-500">
                    <label className="flex items-center ">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none"
                            value={rowPerPage}
                            onChange={(e) => onRowPerPageChange(e.target.value)}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                    <span>Total - {total}</span>
                </div>
                <Pagination
                    color="default"
                    page={currentPage}
                    showControls={true}
                    total={total}
                    variant="light"
                    onChange={onPageChange}
                />
            </div>
        );
    }, [currentPage, onPageChange, onRowPerPageChange, showPagination, rowPerPage, total]);

    if (asDataTable) {
        if (!tableData.length) {
            return null;
        }

        return (
            <section>
                {columns.map((columnKey) => (
                    <dl key={columnKey.label}
                        className="grid grid-cols-1 text-base/6 font-medium sm:grid-cols-6 sm:text-sm/6">
                        <dt className="col-span-2 border-b border-default-200 py-2.5 text-default-500">{columnKey.label}</dt>
                        <dd className="col-span-4 border-b border-default-200 py-2.5">
                            {!!columnKey.key && [null, undefined, ''].includes(tableData[0]?.[columnKey.key]) ? '-' : renderCell(tableData[0], columnKey)}
                        </dd>
                    </dl>
                ))}
            </section>
        );
    }

    return (
        <section aria-label="Payment List" className="flex size-full flex-col">
            {topComponent}
            <Table
                isHeaderSticky
                removeWrapper
                aria-label="Example static collection table"
                classNames={classNames}
                onRowAction={onTableRowClick}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.key}>
                            {column.label}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent="No rows to display." items={tableData}>
                    {(item) => (
                        <TableRow key={item[mainKey]}>
                            {columns.map((columnKey) => (
                                <TableCell key={columnKey.key}>
                                    {!!columnKey.key && [null, undefined, ''].includes(item[columnKey.key]) ? '-' : renderCell(item, columnKey)}
                                </TableCell>
                            ))}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {bottomContent}
        </section>
    );
};
