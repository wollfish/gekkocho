'use client';

import React from 'react';
import { Button } from '@nextui-org/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { ChevronDownIcon } from '@nextui-org/shared-icons';
import { Selection } from '@nextui-org/table';

import { subtitle } from '@/components/primitives';

export const PaymentOverviewTimeSelector: React.FC = React.memo(() => {
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set(['current_week']));

    const selectedValue = React.useMemo(() => Array.from(selectedKeys).join(', ').replaceAll('_', ' '), [selectedKeys]);

    return (
        <div className="relative mb-4 flex w-full flex-wrap items-center justify-between gap-2">
            <p className={subtitle({ size: 'lg', className: 'mr-auto text-default-600 font-bold capitalize' })}>
                {selectedValue} Overview
            </p>
            <p className={subtitle({ size: 'xs', className: 'text-default-600' })}>Short by: </p>
            <Dropdown>
                <DropdownTrigger className="hidden sm:flex">
                    <Button
                        className="capitalize"
                        endContent={<ChevronDownIcon className="text-small"/>}
                        size="sm"
                        variant="flat"
                    >
                        {selectedValue}
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    disallowEmptySelection
                    selectedKeys={selectedKeys}
                    selectionMode="single"
                    onSelectionChange={setSelectedKeys}
                >
                    <DropdownItem key="current_week">Current Week</DropdownItem>
                    <DropdownItem key="last_7_days">Last 7 Days</DropdownItem>
                    <DropdownItem key="last_15_days">Last 15 Days</DropdownItem>
                    <DropdownItem key="last_30_days">Last 30 Days</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
});
