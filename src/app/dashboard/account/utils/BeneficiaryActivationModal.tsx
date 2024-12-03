'use client';

import React from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal';

import { BeneficiaryActivationForm } from '@/app/dashboard/account/utils';

interface OwnProps {
    isOpen: boolean,
    beneficiaryId: string,
    onClose: () => void
}

export const BeneficiaryActivationModal: React.FC<OwnProps> = (props) => {
    const { isOpen, beneficiaryId, onClose } = props;

    return (
        <Modal backdrop="blur" isDismissable={false} isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex gap-1">
                    <span>
                        Activate Beneficiary <sup>#{beneficiaryId}</sup>
                    </span>
                </ModalHeader>
                <ModalBody>
                    <BeneficiaryActivationForm beneficiaryId={beneficiaryId} currencies={[]} onClose={onClose}/>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
