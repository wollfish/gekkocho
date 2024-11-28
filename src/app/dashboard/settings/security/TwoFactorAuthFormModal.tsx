'use client';

import React from 'react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/modal';
import { Switch } from '@nextui-org/switch';

import { useQuery } from '@tanstack/react-query';

import { generateTwoFactorSecret } from '@/actions/dashboard/settings';
import { UserInterface } from '@/lib/zod';

interface OwnProps {
    user: UserInterface;
}

export const TwoFactorAuthFormModal: React.FC<OwnProps> = (props) => {
    const { user } = props;

    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data: _2FAGenResponse, isLoading: _2FAGenResponseLoading } = useQuery({
        queryKey: ['generate_2fa'],
        queryFn: () => generateTwoFactorSecret(),
        retry: isOpen,
    });

    console.log(_2FAGenResponse, user.otp);

    return (
        <React.Fragment>
            <Switch isSelected={user.otp} onValueChange={onOpen}/>
            <Modal backdrop="blur" isDismissable={true} isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Activate or Deactivate 2FA</ModalHeader>
                    <ModalBody/>
                    <ModalFooter/>
                </ModalContent>
            </Modal>
        </React.Fragment>
    );
};
