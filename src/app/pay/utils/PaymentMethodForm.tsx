'use client';

import React, { Suspense, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { setPaymentMethod } from '@/actions/pay';
import { PaymentMethodFormInterface, paymentMethodFormSchema, PaymentMethodInterface } from '@/lib/zod';

interface OwnProps {
    uuid: string;
    methods: PaymentMethodInterface[];
}

export const PaymentMethodForm: React.FC<OwnProps> = (props) => {
    const { uuid, methods } = props;

    const router = useRouter();

    const { handleSubmit, formState, control, reset, watch } = useForm<PaymentMethodFormInterface>({
        resolver: zodResolver(paymentMethodFormSchema),
        defaultValues: {
            uuid: uuid,
            currency: '',
            network: '',
        },
    });

    const onSubmit = async (values: PaymentMethodFormInterface) => {
        const { error, success, data } = await setPaymentMethod(values) || {};

        if (success) {
            router.push(`/pay/${values.uuid}`);
        } else {
            toast.error(error?.message);
        }
    };

    const selectedCurrency = useMemo(() => methods.find((m) => m.currency === watch().currency), [methods, watch().currency]);

    return (
        <form autoComplete="off" className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name="currency"
                render={({ field, formState }) => (
                    <Select
                        errorMessage={formState.errors?.['currency']?.message?.toString()}
                        isInvalid={!!formState.errors?.['currency']?.message}
                        label="Select Currency"
                        labelPlacement="outside"
                        placeholder=" "
                        value={field.value}
                        onChange={field.onChange}
                    >
                        {methods.map((method) => (
                            <SelectItem
                                key={method.currency}
                                startContent={<Avatar className="!size-6" src={method.currency_icon}/>}
                                value={method.currency}
                            >
                                {method.currency}
                            </SelectItem>
                        ))}
                    </Select>
                )}
            />
            <Controller
                control={control}
                name="network"
                render={({ field, formState }) => (
                    <Select
                        errorMessage={formState.errors?.['network']?.message?.toString()}
                        isInvalid={!!formState.errors?.['network']?.message}
                        label="Select Network"
                        labelPlacement="outside"
                        placeholder=" "
                        value={field.value}
                        onChange={field.onChange}
                    >
                        {methods.filter((m) => m.currency === watch().currency).map((method) => (
                            <SelectItem
                                key={method.network}
                                value={method.network}
                            >
                                {method.network?.toUpperCase()}
                            </SelectItem>
                        ))}
                    </Select>
                )}
            />
            <Input
                description={`Conversion Rate: ${selectedCurrency?.exchange_rate || 0}`}
                label="Converted Amount"
                labelPlacement="outside"
                placeholder=" "
                value={selectedCurrency?.real_amount || ''}
            />
            <div className="flex justify-end gap-4">
                <Suspense>
                    <Button
                        color="primary"
                        disabled={formState.isSubmitting}
                        fullWidth={true}
                        isLoading={formState.isSubmitting}
                        type="submit"
                    >
                        Proceed to payment
                    </Button>
                </Suspense>
            </div>
        </form>
    );
};
