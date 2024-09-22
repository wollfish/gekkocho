'use client';

import React from 'react';
import { Button } from '@nextui-org/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import NextLink from 'next/link';

interface OwnProps {
    email: string,
    isOpen: boolean,
    onClose: () => void
}

export const EmailVerificationModal: React.FC<OwnProps> = (props) => {
    const { isOpen, email, onClose } = props;

    return (
        <Modal backdrop="blur" isDismissable={false} isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Verify Your Email</ModalHeader>
                <ModalBody>
                    We have sent a verification link to your email address
                    <span className="font-bold text-primary">{email}</span>
                    Please click on that link to verify your email address. If you have not received the email
                    after a few minutes, please check your spam folder or request a new one.
                </ModalBody>
                <ModalFooter>
                    <Button as={NextLink} href="/login" variant="bordered" onClick={onClose}>Already Verified</Button>
                    <Button>Resend</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
