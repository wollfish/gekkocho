'use client';

import React, { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Controller, useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { toggleTwoFactor } from '@/actions/dashboard/settings';
import { InputOtp } from '@/lib/otpInput';
import { TwoFactorAuthFormInterface, twoFactorAuthFormSchema } from '@/lib/zod';

interface OwnProps {
    onClose: () => void;
    status: boolean;
}

export const TwoFactorAuthForm: React.FC<OwnProps> = (props) => {
    const { handleSubmit, formState, control, reset } = useForm<TwoFactorAuthFormInterface>({
        resolver: zodResolver(twoFactorAuthFormSchema),
        defaultValues: {
            code: '',
            status: props.status ? 'disable' :'enable',
        },
    });

    const onSubmit = async (values: TwoFactorAuthFormInterface) => {
        const { error, success } = await toggleTwoFactor(values) || {};

        if (success) {
            toast.success('Two-factor authentication updated');
            reset();
            props.onClose();
        } else {
            toast.error(error);
        }
    };

    return (
        <form autoComplete="off" className="grid gap-4" method="POST" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name="code"
                render={({ field, formState }) => (
                    <InputOtp
                        color={!!formState.errors?.['code']?.message ? 'danger' : 'default'}
                        errorMessage={formState.errors?.['code']?.message?.toString()}
                        label="Enter Verification Code"
                        otplength={6}
                        radius="lg"
                        variant="faded"
                        onFill={() => handleSubmit(onSubmit)()}
                        onInput={field.onChange}
                    />
                )}
            />
            <Suspense>
                <Button
                    color="primary"
                    disabled={formState.isSubmitting}
                    fullWidth={true}
                    isLoading={formState.isSubmitting}
                    type="submit"
                    variant="flat"
                >
                    Submit
                </Button>
            </Suspense>
        </form>
    );
};
