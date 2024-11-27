'use client';

import React, { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Controller, useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { activateBeneficiary } from '@/actions/dashboard/account';
import { InputOtp } from '@/lib/otpInput';
import {
    BeneficiaryActivationFormInterface,
    beneficiaryActivationFromSchema,
    CurrencyResponseInterface,
} from '@/lib/zod';

interface OwnProps {
    onClose: () => void;
    currencies: CurrencyResponseInterface[];
    beneficiaryId: string;
}

export const BeneficiaryActivationForm: React.FC<OwnProps> = (props) => {
    const { handleSubmit, formState, control, reset } = useForm<BeneficiaryActivationFormInterface>({
        resolver: zodResolver(beneficiaryActivationFromSchema),
        defaultValues: {
            id: String(props.beneficiaryId),
            pin: '',
        },
    });

    const onSubmit = async (values: BeneficiaryActivationFormInterface) => {
        const { error, success } = await activateBeneficiary(values) || {};

        if (success) {
            toast.success('Beneficiary Activated');
            reset();
            props.onClose();
        } else {
            toast.error(error);
        }
    };

    return (
        <form autoComplete="off" className="grid grid-cols-2 gap-4" method="POST" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name="pin"
                render={({ field }) => (
                    <InputOtp
                        classNames={{ segmentWrapper: 'justify-between', base: 'w-full' }}
                        color={!!formState.errors?.pin?.message ? 'danger' : 'default'}
                        errorMessage={formState.errors?.pin?.message}
                        otplength={6}
                        radius="lg"
                        variant="faded"
                        onFill={() => handleSubmit(onSubmit)()}
                        onInput={field.onChange}
                    />
                )}
            />
            <div className="col-span-2 flex justify-end gap-4">
                <Suspense>
                    <Button
                        variant="bordered"
                        onClick={() => reset()}
                    >
                        Clear All
                    </Button>
                    <Button
                        color="primary"
                        disabled={formState.isSubmitting}
                        isLoading={formState.isSubmitting}
                        type="submit"
                        onClick={() => handleSubmit(onSubmit)()}
                    >
                        Activate Beneficiary
                    </Button>
                </Suspense>
            </div>
        </form>
    );
};
