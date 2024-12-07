'use client';

import React from 'react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';

import { WithdrawalForm } from '@/app/dashboard/account/utils';
import { AccountResponseInterface } from '@/lib/zod';

interface OwnProps {
    isOpen: boolean;
    onClose: () => void;
    selectedAccount?: string;
    accounts: AccountResponseInterface[];
}

export const WithdrawFormModal: React.FC<OwnProps> = (props) => {
    const { isOpen, accounts, selectedAccount, onClose } = props;

    return (
        <Modal backdrop="blur" isDismissable={false} isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Create New Withdrawal</ModalHeader>
                <ModalBody>
                    <WithdrawalForm
                        accounts={accounts}
                        selectedAccount={selectedAccount}
                        onClose={onClose}
                    />
                </ModalBody>
                <ModalFooter/>
            </ModalContent>
        </Modal>
    );
};
