'use client';

import React, { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { getCurrencyList } from '@/actions/dashboard/account';
import { initializePayment } from '@/actions/dashboard/payment';
import { Icons } from '@/components/icons';
import { CryptoIcon } from '@/lib/misc/CryptoIcon';
import { generateRandomId } from '@/lib/utils';
import { PaymentFormInterface, paymentFormSchema } from '@/lib/zod';

interface OwnProps {
    onClose: () => void
}

export const PaymentForm: React.FC<OwnProps> = (props) => {

    const { onClose } = props;

    const { data: currencies, isLoading: currenciesLoading } = useQuery({
        queryKey: ['currencies'],
        queryFn: () => getCurrencyList(),
    });

    const { handleSubmit, formState, control, reset, setValue } = useForm<PaymentFormInterface>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
            product_name: '',
            req_amount: null,
            req_currency: '',
            customer_email: '',
            customer_name: '',
            reference_id: '',
        },
    });

    const onSubmit = async (values: PaymentFormInterface) => {
        const { error, success, data } = await initializePayment(values) || {};

        if (success) {
            navigator.clipboard.writeText(`https://pay.coinfinacle.com/pay/${data?.id}`).then(() => {
                toast.success('Payment link Copied to clipboard');
            }).catch(() => {
                toast.error('Failed to copy payment link');
            }).finally(() => onClose());
        } else {
            toast.error(error);
        }
    };

    const onRandomise = () => setValue('reference_id', generateRandomId());

    return (
        <form autoComplete="off" className="grid grid-cols-2 gap-4" method="POST" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name="product_name"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        className="col-span-2"
                        errorMessage={formState.errors?.['product_name']?.message?.toString()}
                        isInvalid={!!formState.errors?.['product_name']?.message}
                        label="Product Name"
                        labelPlacement="outside"
                        placeholder=" "
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <div className="col-span-2 grid grid-cols-6 items-start gap-4">
                <Controller
                    control={control}
                    name="req_currency"
                    render={({ field, formState }) => (
                        <Select
                            className="col-span-2"
                            errorMessage={formState.errors?.['req_currency']?.message?.toString()}
                            isInvalid={!!formState.errors?.['req_currency']?.message}
                            isLoading={currenciesLoading}
                            items={currencies?.data || []}
                            label="Currency"
                            labelPlacement="outside"
                            placeholder=" "
                            selectedKeys={[field.value]}
                            onChange={field.onChange}
                        >
                            {(currency) => (
                                <SelectItem
                                    key={currency.id}
                                    classNames={{ selectedIcon: 'hidden' }}
                                    startContent={<CryptoIcon code={currency.id}/>}
                                    textValue={currency.id?.toUpperCase()}
                                >
                                    {currency.id?.toUpperCase()}
                                </SelectItem>
                            )}
                        </Select>
                    )}
                />
                <Controller
                    control={control}
                    name="req_amount"
                    render={({ field, formState }) => (
                        <Input
                            autoComplete="off"
                            className="col-span-4"
                            errorMessage={formState.errors?.['req_amount']?.message?.toString()}
                            isInvalid={!!formState.errors?.['req_amount']?.message}
                            label="Request Amount"
                            labelPlacement="outside"
                            placeholder=" "
                            type="number"
                            value={String(field.value)}
                            onChange={field.onChange}
                        />
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
                        endContent={
                            <Button isIconOnly={true} radius="full" size="sm" type="button" onClick={onRandomise}>
                                <Icons.dice className="size-4"/>
                            </Button>
                        }
                        errorMessage={formState.errors?.['reference_id']?.message?.toString()}
                        isInvalid={!!formState.errors?.['reference_id']?.message}
                        label="Order Id"
                        labelPlacement="outside"
                        placeholder=" "
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Controller
                control={control}
                name="customer_name"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        className="col-span-2"
                        errorMessage={formState.errors?.['customer_name']?.message?.toString()}
                        isInvalid={!!formState.errors?.['customer_name']?.message}
                        label="Customer Name (Optional)"
                        labelPlacement="outside"
                        placeholder=" "
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Controller
                control={control}
                name="customer_email"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        className="col-span-2"
                        errorMessage={formState.errors?.['customer_email']?.message?.toString()}
                        isInvalid={!!formState.errors?.['customer_email']?.message}
                        label="Customer Email (Optional)"
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
