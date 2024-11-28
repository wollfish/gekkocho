'use client';

import React, { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { Controller, useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { initializePayment } from '@/actions/dashboard/payment';
import { PaymentFormInterface, paymentFormSchema } from '@/lib/zod';

interface OwnProps {
    onClose: () => void
}

export const PaymentForm: React.FC<OwnProps> = (props) => {

    const { onClose } = props;

    const { handleSubmit, formState, control, reset } = useForm<PaymentFormInterface>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
            reference_id: '',
            req_amount: null,
            req_currency: '',
            redirect_url: '',
        },
    });

    const onSubmit = async (values: PaymentFormInterface) => {
        const { error, success, data } = await initializePayment(values) || {};

        if (success) {
            onClose();
        } else {
            toast.error(error);
        }
    };

    return (
        <form autoComplete="off" className="grid grid-cols-2 gap-4" method="POST" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-span-2 grid grid-cols-6 items-start gap-4">
                <Controller
                    control={control}
                    name="req_amount"
                    render={({ field, formState }) => (
                        <Input
                            autoComplete="off"
                            className="col-span-4"
                            errorMessage={formState.errors?.['req_amount']?.message?.toString()}
                            isInvalid={!!formState.errors?.['req_amount']?.message}
                            label="Requested Amount"
                            labelPlacement="outside"
                            placeholder=" "
                            type="number"
                            value={String(field.value)}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="req_currency"
                    render={({ field, formState }) => (
                        <Select
                            className="col-span-2"
                            errorMessage={formState.errors?.['req_currency']?.message?.toString()}
                            isInvalid={!!formState.errors?.['req_currency']?.message}
                            label="Currency"
                            labelPlacement="outside"
                            placeholder=" "
                            value={field.value}
                            onChange={field.onChange}
                        >
                            <SelectItem
                                key="usd"
                                classNames={{ selectedIcon: 'hidden' }}
                                startContent={<Avatar className="!size-6" src="https://flagcdn.com/us.svg"/>}
                            >
                                USD
                            </SelectItem>
                            <SelectItem
                                key="inr"
                                classNames={{ selectedIcon: 'hidden' }}
                                startContent={<Avatar className="!size-6" src="https://flagcdn.com/in.svg"/>}
                            >
                                INR
                            </SelectItem>
                            <SelectItem
                                key="pound"
                                classNames={{ selectedIcon: 'hidden' }}
                                startContent={<Avatar className="!size-6" src="https://flagcdn.com/fr.svg"/>}
                            >
                                POUND
                            </SelectItem>
                        </Select>
                    )}
                />
            </div>
            <Controller
                control={control}
                name="reference_id"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        className="col-span-2"
                        errorMessage={formState.errors?.['reference_id']?.message?.toString()}
                        isInvalid={!!formState.errors?.['reference_id']?.message}
                        label="Reference Id"
                        labelPlacement="outside"
                        placeholder=" "
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            {/*<Controller*/}
            {/*    control={control}*/}
            {/*    name=""*/}
            {/*    render={({ field, formState }) => (*/}
            {/*        <Input*/}
            {/*            autoComplete="off"*/}
            {/*            errorMessage={formState.errors?.['order_description']?.message?.toString()}*/}
            {/*            isInvalid={!!formState.errors?.['order_description']?.message}*/}
            {/*            label="Order Desc (Optional)"*/}
            {/*            labelPlacement="outside"*/}
            {/*            placeholder=" "*/}
            {/*            value={field.value}*/}
            {/*            onChange={field.onChange}*/}
            {/*        />*/}
            {/*    )}*/}
            {/*/>*/}
            <Controller
                control={control}
                name="redirect_url"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        className="col-span-2"
                        errorMessage={formState.errors?.['redirect_url']?.message?.toString()}
                        isInvalid={!!formState.errors?.['redirect_url']?.message}
                        label="Redirect URL (Optional)"
                        labelPlacement="outside"
                        placeholder=" "
                        value={field.value}
                        onChange={field.onChange}
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
                    >
                        Create Payment
                    </Button>
                </Suspense>
            </div>
        </form>
    );
};
