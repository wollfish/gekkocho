'use client';

import React, { Suspense, useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';

import { Snippet } from '@nextui-org/snippet';
import { Controller, useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { deleteApiKey, generateApiKey, updateApiKey } from '@/actions/dashboard/settings';
import { Icons } from '@/components/icons';
import { description, subtitle } from '@/components/primitives';
import { ApiResponse } from '@/lib/api';

import { InputOtp } from '@/lib/otpInput';
import { ApiKeyFormInterface, apiKeyFormSchema, ApiKeyResponseInterface } from '@/lib/zod';

interface OwnProps {
    isOpen: boolean,
    selectedApiKey?: ApiKeyResponseInterface,
    action: 'create' | 'update' | 'delete'
    onClose: () => void
}

export const ApiKeyFormModal: React.FC<OwnProps> = (props) => {
    const { isOpen, selectedApiKey, action, onClose } = props;

    const [data, setData] = React.useState<ApiResponse<ApiKeyResponseInterface>>(null);

    const { handleSubmit, formState, control , setValue } = useForm<ApiKeyFormInterface>({
        resolver: zodResolver(apiKeyFormSchema),
        defaultValues: {
            totp_code: '',
            kid: '',
            state: '',
            algorithm: 'HS256',
        },
    });

    useEffect(() => {
        setValue('kid', selectedApiKey?.kid);
        setValue('state', selectedApiKey?.state === 'active' ? 'disabled' : 'active');
    }, [selectedApiKey?.kid, selectedApiKey?.state, setValue]);

    const onSubmit = async (payload: ApiKeyFormInterface) => {
        let data: ApiResponse;

        switch (action) {
            case 'create':
                data = await generateApiKey(payload);
                break;
            case 'update':
                data = await updateApiKey(payload);
                break;
            case 'delete':
                data = await deleteApiKey(payload);
                break;
            default:
                throw new Error(`Unsupported action: ${action}`);
        }

        if (data.success && action === 'create') {
            setData(data);
        } else if (data.success) {
            toast.success(`API key ${action}d successfully`);
            onClose();
        } else {
            toast.error(data.error);
        }
    };

    const onCloseModal = useCallback(() => {
        setData(null);
        onClose();
    },[onClose]);

    const renderApiKeyCreateSuccessMsg = useCallback(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex gap-2 rounded bg-danger/10 p-2">
                    <Icons.info className="text-danger" size="24"/>
                    <p className={description({ className: 'm-0', size: 'xs' })}>
                        The generated Secret Key below is only visible this one time, and is not recoverable.
                        If you lose this key, you will have to generate a new key pair.
                    </p>
                </div>
                <div>
                    <p className={subtitle({ size: 'xs', className: 'mb-2' })}>Access Key</p>
                    <Snippet
                        hideSymbol
                        className="w-full"
                        classNames={{ pre: 'break-all whitespace-normal' }}
                        radius="sm"
                    >
                        {data?.data?.kid}
                    </Snippet>
                </div>
                <div>
                    <p className={subtitle({ size: 'xs', className: 'mb-2' })}>Secret Key</p>
                    <Snippet
                        hideSymbol
                        className="w-full"
                        classNames={{ pre: 'break-all whitespace-normal' }}
                        radius="sm"
                    >
                        {data?.data?.secret}
                    </Snippet>
                </div>
                <Button
                    color="primary"
                    disabled={formState.isSubmitting}
                    fullWidth={true}
                    isLoading={formState.isSubmitting}
                    variant="flat"
                    onClick={onCloseModal}
                >
                    Saved, Close now!
                </Button>
            </div>
        );
    }, [data, formState, onCloseModal]);

    return (
        <Modal backdrop="blur" isDismissable={false} isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h3 className="capitalize">{action} API Key</h3>
                </ModalHeader>
                <ModalBody>
                    {data?.success && action === 'create'
                        ? renderApiKeyCreateSuccessMsg()
                        :
                        <form autoComplete="off" className="grid gap-4" method="POST"
                            onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                control={control}
                                name="totp_code"
                                render={({ field, formState }) => (
                                    <InputOtp
                                        color={!!formState.errors?.['totp_code']?.message ? 'danger' : 'default'}
                                        errorMessage={formState.errors?.['totp_code']?.message?.toString()}
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
                    }
                </ModalBody>
                <ModalFooter/>
            </ModalContent>
        </Modal>
    );
};
