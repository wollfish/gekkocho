'use client';

import React from 'react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';

import { BeneficiaryForm } from '@/app/dashboard/wallet/utils';

interface OwnProps {
    isOpen: boolean,
    onClose: () => void
}

export const BeneficiaryFormModal: React.FC<OwnProps> = (props) => {
    const { isOpen, onClose } = props;

    return (
        <Modal backdrop="blur" isDismissable={false} isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Create New Beneficiary</ModalHeader>
                <ModalBody>
                    <BeneficiaryForm onClose={onClose}/>
                </ModalBody>
                <ModalFooter/>
            </ModalContent>
        </Modal>
    );
};
