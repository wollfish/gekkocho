'use client';

import React, { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';
import { Controller, useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { activateBeneficiary, resendBeneficiaryActivation } from '@/actions/dashboard/account';
import { ResendOTPCountdown } from '@/app/dashboard/account/utils';
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

    const resendOTP = async () => {
        const { error, success } = await resendBeneficiaryActivation({ id: props.beneficiaryId }) || {};

        if (success) {
            toast.success('OTP Resent');
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
                        classNames={{ base: 'w-full col-span-2' }}
                        color={!!formState.errors?.pin?.message ? 'danger' : 'default'}
                        errorMessage={formState.errors?.pin?.message}
                        label="Enter 6 digit PIN received on your email"
                        otplength={6}
                        radius="lg"
                        value={field.value}
                        variant="faded"
                        onFill={() => handleSubmit(onSubmit)()}
                        onInput={field.onChange}
                    />
                )}
            />
            <div className="col-span-2 flex gap-4">
                <Suspense>
                    <Button
                        color="primary"
                        disabled={formState.isSubmitting}
                        fullWidth={true}
                        isLoading={formState.isSubmitting}
                        type="submit"
                        onClick={() => handleSubmit(onSubmit)()}
                    >
                        Activate Beneficiary
                    </Button>
                </Suspense>
            </div>
            <div className="col-span-2">
                <Divider/>
                <div className="py-4 text-sm">
                    <ResendOTPCountdown initialCountdown={60} onResend={resendOTP}/>
                </div>
            </div>
        </form>
    );
};
