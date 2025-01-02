'use client';

import React, { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';

import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { z } from 'zod';

import { forgetPassword } from '@/actions/auth';

interface OwnProps {
    email: string,
    isOpen: boolean,
    onClose: () => void
}

export const ForgetPasswordModal: React.FC<OwnProps> = (props) => {
    const { isOpen, email: initialEmail, onClose } = props;

    const { handleSubmit, formState, control, setValue } = useForm({
        resolver: zodResolver(z.object({
            email: z.string().min(1, 'Email is required').email('Invalid email'),
        })),
        defaultValues: {
            email: '',
        },
    });

    React.useEffect(() => {
        setValue('email', initialEmail);
    }, [initialEmail, setValue]);

    const onSubmit = async (values: { email: string }) => {
        const { success, error } = await forgetPassword(values);

        if (success) {
            toast.success('Password reset link sent successfully, please check your email');
            onClose();
        } else {
            toast.error(error || 'Something went wrong');
        }
    };

    return (
        <Modal backdrop="blur" isDismissable={false} isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader className="flex flex-col gap-1">Reset Your Password</ModalHeader>
                    <ModalBody>
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
                    </ModalBody>
                    <ModalFooter>
                        <Suspense>
                            <Button
                                color="primary"
                                disabled={formState.isSubmitting}
                                isLoading={formState.isSubmitting}
                                type="submit"
                            >
                                Send Reset Link
                            </Button>
                        </Suspense>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};
