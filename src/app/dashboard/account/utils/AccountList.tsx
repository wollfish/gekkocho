'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '@nextui-org/button';
import { useDisclosure } from '@nextui-org/modal';

import { WithdrawFormModal } from '@/app/dashboard/account/utils/WithdrawFormModal';
import { Icons } from '@/components/icons';
import { TableColumnInterface, YukiTable } from '@/components/ui/YukiTable';
import { AccountResponseInterface } from '@/lib/zod';

const columns: TableColumnInterface[] = [
    { key: 'id', type: 'id', label: 'ID' },
    { key: 'currency', type: 'currency', label: 'Currency' },
    {
        key: 'balance',
        type: 'number',
        label: 'Available Balance',
        options: { withCurrency: true, linked_column: 'currency' },
    },
    {
        key: 'locked',
        type: 'number',
        label: 'Locked Balance',
        options: { withCurrency: true, linked_column: 'currency' },
    },
    {
        key: 'total_blc',
        type: 'number',
        label: 'Total Balance',
        options: { withCurrency: true, linked_column: 'currency' },
    },
    {
        key: 'total_blc_in_platform_currency',
        type: 'number',
        label: 'Est. Balance (AED)',
        options: { withCurrency: true, linked_column: 'user_currency' },
    },
    { key: 'cta', type: 'cta', label: 'Actions' },
];

type ExtendedAccountType = AccountResponseInterface & {
    total_blc: number;
    main_currency: string,
    user_currency: string,
    avl_blc_in_main_currency: number;
    locked_blc_in_main_currency: number;
    total_blc_in_main_currency: number;
    avl_blc_in_platform_currency: number;
    locked_blc_in_platform_currency: number;
    total_blc_in_platform_currency: number;
};

interface OwnProps {
    accounts: ExtendedAccountType[];
}

export const AccountList: React.FC<OwnProps> = (props) => {
    const { accounts } = props;

    const {
        isOpen: isWithdrawFormModalOpen,
        onOpen: onWithdrawFormModalOpen,
        onClose: onWithdrawFormModalClose,
    } = useDisclosure();

    const [selectedAccount, setSelectedAccount] = useState<AccountResponseInterface['currency']>(null);

    const onTableRowClick = useCallback((key: AccountResponseInterface['currency']) => {
        setSelectedAccount(String(key));
        onWithdrawFormModalOpen();
    }, [onWithdrawFormModalOpen]);

    const ctaEle = useCallback((data: AccountResponseInterface) => {
        return (
            <Button size="sm" variant="bordered" onClick={() => onTableRowClick(data.currency)}>
                <span>Payout</span>
                <Icons.wallet/>
            </Button>
        );
    }, [onTableRowClick]);

    const tableData = useMemo(() => {
        return accounts
            .filter((item) => item.wallet_type !== 'p2p')
            .map((item, index) => ({
                ...item,
                id: index + 1,
                cta: ctaEle(item),
                user_currency: item.user_currency,
                total_blc_in_platform_currency: item.total_blc_in_platform_currency.toFixed(2),
            }));
    }, [accounts, ctaEle]);

    return (
        <React.Fragment>
            <YukiTable
                columns={columns}
                tableData={tableData}
            />
            <WithdrawFormModal
                accounts={tableData}
                isOpen={isWithdrawFormModalOpen}
                selectedAccount={selectedAccount}
                onClose={onWithdrawFormModalClose}
            />
        </React.Fragment>
    );
};
