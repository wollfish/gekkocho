'use client';

import React, { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Controller, useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { updatePassword } from '@/actions/auth';
import { InputPassword } from '@/lib/passwordInput';
import { PasswordUpdateFormInterface, passwordUpdateFormSchema } from '@/lib/zod';

export const UpdatePasswordForm: React.FC = () => {
    const { handleSubmit, formState, control, reset } = useForm<PasswordUpdateFormInterface>({
        resolver: zodResolver(passwordUpdateFormSchema),
        defaultValues: {
            old_password: '',
            new_password: '',
            confirm_password: '',
        },
    });

    const onSubmit = async (values: PasswordUpdateFormInterface) => {
        const { error, success } = await updatePassword(values);

        if (success) {
            toast.success('Password updated successfully');
            reset();
        } else {
            toast.error(error);
        }
    };

    return (
        <form className="col-span-4 grid grid-cols-2 gap-x-8 gap-y-4 text-sm" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name="old_password"
                render={({ field, formState }) => (
                    <InputPassword
                        autoComplete="off"
                        errorMessage={formState.errors?.['old_password']?.message?.toString()}
                        isInvalid={!!formState.errors?.['old_password']?.message}
                        label="Current Password"
                        size="sm"
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Controller
                control={control}
                name="new_password"
                render={({ field, formState }) => (
                    <InputPassword
                        autoComplete="new-password"
                        errorMessage={formState.errors?.['new_password']?.message?.toString()}
                        isInvalid={!!formState.errors?.['new_password']?.message}
                        label="New Password"
                        size="sm"
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
                        autoComplete="new-password"
                        errorMessage={formState.errors?.['confirm_password']?.message?.toString()}
                        isInvalid={!!formState.errors?.['confirm_password']?.message}
                        label="Repeat New Password"
                        size="sm"
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <div className="flex justify-end gap-2">
                <Button
                    isDisabled={formState.isSubmitting}
                    type="reset"
                    variant="flat"
                    onPress={() => reset()}
                >
                    Clear
                </Button>
                <Suspense>
                    <Button
                        color="primary"
                        isDisabled={formState.isSubmitting}
                        isLoading={formState.isSubmitting}
                        type="submit"
                    >
                        Submit
                    </Button>
                </Suspense>
            </div>
        </form>
    );
};
