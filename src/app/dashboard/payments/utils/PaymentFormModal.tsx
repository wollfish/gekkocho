'use client';

import React from 'react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';

import { PaymentForm } from '@/app/dashboard/payments/utils';

interface OwnProps {
    isOpen: boolean,
    onClose: () => void
}

export const PaymentFormModal: React.FC<OwnProps> = (props) => {
    const { isOpen, onClose } = props;

    return (
        <Modal backdrop="blur" isDismissable={false} isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Create New Payment</ModalHeader>
                <ModalBody>
                    <PaymentForm onClose={onClose}/>
                </ModalBody>
                <ModalFooter/>
            </ModalContent>
        </Modal>
    );
};
