'use client';

import React, { Suspense, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { Input } from '@nextui-org/input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/modal';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@nextui-org/shared-icons';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { doLogin } from '@/actions/auth';
import { EmailVerificationModal } from '@/components/AuthPages/EmailVerificationModal';
import { link } from '@/components/primitives';
import { ERROR_CODE_ACCOUNT_VERIFICATION_PENDING, ERROR_CODE_OTP_REQUIRED } from '@/lib/errors';
import { InputOtp } from '@/lib/otpInput';
import { SignInSchema, signInSchema } from '@/lib/zod';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

export const LoginForm = () => {
    const [isVisible, setIsVisible] = useState(false);
    const {
        isOpen: isOtpModalOpen,
        onOpen: onOtpModalOpen,
        onClose: onOtpModalClose,
    } = useDisclosure();
    const {
        isOpen: isVerificationModalOpen,
        onOpen: onVerificationModalOpen,
        onClose: onVerificationModalClose,
    } = useDisclosure();

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || DEFAULT_LOGIN_REDIRECT;

    const toggleVisibility = () => setIsVisible(!isVisible);

    const { handleSubmit, formState, control, watch, getValues, resetField } = useForm<SignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
            otp: '',
            remember: false,
        },
    });

    const onSubmit = async (values: SignInSchema) => {
        const { error } = await doLogin(values, callbackUrl) || {};

        if (!error) return;

        if (error.code === ERROR_CODE_OTP_REQUIRED) {
            onOtpModalOpen();
        } else if (error.code === ERROR_CODE_ACCOUNT_VERIFICATION_PENDING) {
            onVerificationModalOpen();
        } else {
            toast.error(error?.message);
        }
    };

    const handelOtpModalClose = () => {
        resetField('otp');
        onOtpModalClose();
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
                        <Input
                            autoComplete="off"
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400"/>
                                    ) : (
                                        <EyeFilledIcon className="pointer-events-none text-2xl text-default-400"/>
                                    )}
                                </button>
                            }
                            errorMessage={formState.errors?.['password']?.message?.toString()}
                            isInvalid={!!formState.errors?.['password']?.message}
                            label="Password"
                            labelPlacement="outside"
                            placeholder=" "
                            type={isVisible ? 'text' : 'password'}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <div className="flex items-center justify-between">
                    <Controller
                        control={control}
                        name="remember"
                        render={({ field }) => (
                            <Checkbox checked={field.value} onChange={field.onChange}>
                                Remember me
                            </Checkbox>
                        )}
                    />
                    <NextLink className={link().base({ size: 'xs' })} href={'/'} prefetch={true}>
                        Forget Password?
                    </NextLink>
                </div>
                <Suspense>
                    <Button
                        color="primary"
                        disabled={formState.isSubmitting || isOtpModalOpen}
                        isLoading={!isOtpModalOpen && formState.isSubmitting}
                        type="submit"
                    >
                        Sign In
                    </Button>
                </Suspense>
            </form>
            <Modal backdrop="blur" isDismissable={false} isOpen={isOtpModalOpen} onClose={handelOtpModalClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">2FA Code</ModalHeader>
                    <ModalBody>
                        <Controller
                            control={control}
                            name="otp"
                            render={({ field }) => (
                                <InputOtp
                                    classNames={{ segmentWrapper: 'justify-between', base: 'w-full' }}
                                    color={!!formState.errors?.otp?.message ? 'danger' : 'default'}
                                    errorMessage={formState.errors?.otp?.message}
                                    otplength={6}
                                    radius="lg"
                                    variant="faded"
                                    onFill={() => handleSubmit(onSubmit)()}
                                    onInput={field.onChange}
                                />
                            )}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Suspense>
                            <Button
                                color="primary"
                                isDisabled={watch('otp')?.length !== 6}
                                isLoading={formState.isSubmitting}
                                type="submit"
                                onClick={() => handleSubmit(onSubmit)()}
                            >
                                Submit
                            </Button>
                        </Suspense>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <EmailVerificationModal
                email={getValues().email}
                isOpen={isVerificationModalOpen}
                onClose={onVerificationModalClose}
            />
        </>
    );
};
