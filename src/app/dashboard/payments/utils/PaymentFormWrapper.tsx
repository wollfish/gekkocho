'use client';

import React from 'react';
import { Button } from '@nextui-org/button';
import { useDisclosure } from '@nextui-org/modal';

import { PaymentFormModal } from '@/app/dashboard/payments/utils';

export const PaymentFormWrapper: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <section className="grid size-full place-content-center">
            <Button aria-label="Create New Payment" color="primary" onClick={onOpen}>Create New Payment</Button>
            <PaymentFormModal isOpen={isOpen} onClose={onClose}/>
        </section>
    );
};