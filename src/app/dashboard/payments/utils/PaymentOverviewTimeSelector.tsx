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
        <div className="relative mb-4 flex flex-wrap items-center gap-2">
            <p className={subtitle({ size: 'lg', className: 'mr-auto text-default-600 font-bold' })}>
                This Week’s Overview
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
                    <DropdownItem key="last_week">Last Week</DropdownItem>
                    <DropdownItem key="last_30_days">Last 30 Days</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
});
