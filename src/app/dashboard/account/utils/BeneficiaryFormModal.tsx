'use client';

import React from 'react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';

import { BeneficiaryCryptoForm, BeneficiaryFiatForm } from '@/app/dashboard/account/utils';
import { CurrencyResponseInterface } from '@/lib/zod';

interface OwnProps {
    isOpen: boolean;
    type: 'coin' | 'fiat';
    currencies: CurrencyResponseInterface[];
    onClose: () => void;
}

export const BeneficiaryFormModal: React.FC<OwnProps> = (props) => {
    const { isOpen, type, currencies, onClose } = props;

    const fiatCurrencies = currencies.filter((currency) => currency.type === 'fiat');
    const coinCurrencies = currencies.filter((currency) => currency.type === 'coin');

    return (
        <Modal backdrop="blur" isDismissable={false} isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    Add New {type === 'coin' ? 'Crypto Account' : 'Bank Account'}
                </ModalHeader>
                <ModalBody>
                    {type === 'coin'
                        ? <BeneficiaryCryptoForm currencies={coinCurrencies} onClose={onClose}/>
                        : <BeneficiaryFiatForm currencies={fiatCurrencies} onClose={onClose}/>
                    }
                </ModalBody>
                <ModalFooter/>
            </ModalContent>
        </Modal>
    );
};
