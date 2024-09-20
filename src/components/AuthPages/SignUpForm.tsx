'use client';

import React, { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { Input } from '@nextui-org/input';
import { useDisclosure } from '@nextui-org/modal';
import { useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { doRegister } from '@/actions/auth';
import { EmailVerificationModal } from '@/components/AuthPages/EmailVerificationModal';
import { ERROR_CODE_ACCOUNT_VERIFICATION_PENDING } from '@/lib/errors';
import { InputPassword } from '@/lib/passwordInput';
import { SignUpSchema, signUpSchema } from '@/lib/zod';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

export const SignUpForm: React.FC = () => {
    const searchParams = useSearchParams();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const callbackUrl = searchParams.get('callbackUrl') || DEFAULT_LOGIN_REDIRECT;
    const referralCode = searchParams.get('referral_code') || '';

    const { handleSubmit, formState, control, getValues } = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            password: '',
            confirm_password: '',
            referral_code: referralCode,
            terms: false,
        },
    });

    const onSubmit = async (values: SignUpSchema) => {
        const { error } = await doRegister(values, callbackUrl) || {};

        if (!error) return;

        if (error && error.code === ERROR_CODE_ACCOUNT_VERIFICATION_PENDING) {
            onOpen();
        } else {
            toast.error(error?.message);
        }
    };

    const onModalClose = () => {
        onClose();
    };

    return (
        <>
            <form autoComplete="off" className="flex flex-col gap-6" method="POST" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name="email"
                    render={({ field, formState }) => (
                        <Input
                            autoComplete="off"
                            errorMessage={formState.errors?.['email']?.message?.toString()}
                            isInvalid={!!formState.errors?.['email']?.message}
                            label="Email"
                            labelPlacement="outside"
                            placeholder="Jhon@doe.com"
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="password"
                    render={({ field, formState }) => (
                        <InputPassword
                            autoComplete="off"
                            errorMessage={formState.errors?.['password']?.message?.toString()}
                            isInvalid={!!formState.errors?.['password']?.message}
                            label="Password"
                            labelPlacement="outside"
                            placeholder=" "
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="confirm_password"
                    render={({ field, formState }) => (
                        <InputPassword
                            autoComplete="off"
                            errorMessage={formState.errors?.['confirm_password']?.message?.toString()}
                            isInvalid={!!formState.errors?.['confirm_password']?.message}
                            label="Confirm Password"
                            labelPlacement="outside"
                            placeholder=" "
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="referral_code"
                    render={({ field, formState }) => (
                        <Input
                            autoComplete="off"
                            errorMessage={formState.errors?.['referral_code']?.message?.toString()}
                            isInvalid={!!formState.errors?.['referral_code']?.message}
                            isRequired={false}
                            label="Referral Code (optional)"
                            labelPlacement="outside"
                            placeholder=" "
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="terms"
                    render={({ field }) => (
                        <Checkbox
                            checked={field.value}
                            isInvalid={!!formState.errors?.['terms']?.message}
                            onChange={field.onChange}
                        >
                            <span className="text-sm"> I agree to the Terms & Conditions and Privacy policy</span>
                        </Checkbox>
                    )}
                />
                <Suspense>
                    <Button
                        color="primary"
                        disabled={formState.isSubmitting}
                        isLoading={formState.isSubmitting}
                        type="submit"
                    >
                        Sign Up
                    </Button>
                </Suspense>
            </form>
            <EmailVerificationModal email={getValues().email} isOpen={isOpen} onClose={onModalClose}/>
        </>
    );
};
