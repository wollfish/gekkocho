'use client';

import React, { Suspense, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { Controller, useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { setPaymentMethod } from '@/actions/pay';
import { CryptoIcon } from '@/lib/misc/CryptoIcon';
import { convertCurrency } from '@/lib/utils';
import {
    PaymentMethodFormInterface,
    paymentMethodFormSchema,
    PaymentMethodInterface,
    PaymentResponseInterface,
} from '@/lib/zod';

interface OwnProps {
    uuid: string;
    payment: PaymentResponseInterface;
    methods: PaymentMethodInterface[];
}

export const PaymentMethodForm: React.FC<OwnProps> = (props) => {
    const { uuid, payment, methods } = props;

    const { handleSubmit, formState, control, watch } = useForm<PaymentMethodFormInterface>({
        resolver: zodResolver(paymentMethodFormSchema),
        defaultValues: {
            payment_id: String(uuid),
            pay_currency: '',
            pay_blockchain: '',
            customer_name: payment.customer?.name || '',
            customer_email: payment.customer?.email || '',
        },
    });

    const onSubmit = async (values: PaymentMethodFormInterface) => {
        const { error } = await setPaymentMethod(values) || {};

        if (error) {
            toast.error(error);
        }
    };

    const selectedCurrencyId = watch('pay_currency');
    const selectedCurrency = useMemo(() => methods.find((m) => m.id === selectedCurrencyId), [methods, selectedCurrencyId]);
    const convertedAmount = useMemo(() => {
        if (selectedCurrency) {
            return convertCurrency(methods, payment.req_amount, payment.req_currency, selectedCurrency.id);
        }
    }, [selectedCurrency, methods, payment.req_amount, payment.req_currency]);

    return (
        <form autoComplete="off" className="grid grid-cols-12 gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name="customer_email"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        className="col-span-12"
                        errorMessage={formState.errors?.['customer_email']?.message?.toString()}
                        isInvalid={!!formState.errors?.['customer_email']?.message}
                        label="Email"
                        labelPlacement="outside"
                        placeholder="Enter your email"
                        type="email"
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
                        className="col-span-12"
                        errorMessage={formState.errors?.['customer_name']?.message?.toString()}
                        isInvalid={!!formState.errors?.['customer_name']?.message}
                        label="Name"
                        labelPlacement="outside"
                        placeholder="Enter your name"
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Divider className="col-span-12"/>
            <Controller
                control={control}
                name="pay_currency"
                render={({ field, formState }) => (
                    <Select
                        className="col-span-7"
                        errorMessage={formState.errors?.['pay_currency']?.message?.toString()}
                        isInvalid={!!formState.errors?.['pay_currency']?.message}
                        items={methods.filter((m) => m.currency_type === 'coin')}
                        label="Select Currency"
                        labelPlacement="outside"
                        placeholder="Pick a currency"
                        selectedKeys={[field.value]}
                        onChange={field.onChange}
                    >
                        {(method) => (
                            <SelectItem
                                key={method.id}
                                startContent={<CryptoIcon code={method.id}/>}
                                textValue={method.currency_name}
                            >
                                {method.currency_name}
                            </SelectItem>
                        )}
                    </Select>
                )}
            />
            <Controller
                control={control}
                name="pay_blockchain"
                render={({ field, formState }) => (
                    <Select
                        className="col-span-5"
                        disallowEmptySelection={true}
                        errorMessage={formState.errors?.['pay_blockchain']?.message?.toString()}
                        isInvalid={!!formState.errors?.['pay_blockchain']?.message}
                        items={selectedCurrency?.networks || []}
                        label="Select Network"
                        labelPlacement="outside"
                        placeholder=" "
                        selectedKeys={[field.value]}
                        onChange={field.onChange}
                    >
                        {(network) => (
                            <SelectItem
                                key={network.blockchain_key}
                                textValue={network.protocol || network.blockchain_key}
                            >
                                {network.protocol || network.blockchain_key}
                            </SelectItem>
                        )}
                    </Select>
                )}
            />
            <Input
                className="col-span-12"
                description={`Conversion Rate: 1 ${selectedCurrency?.id?.toUpperCase()} = ${(convertedAmount?.[1])?.toFixed(2) || 0} ${payment?.req_currency.toUpperCase()}`}
                disabled={true}
                label="Converted Amount"
                labelPlacement="outside"
                placeholder="Converted Amount..."
                value={(convertedAmount?.[0] || '') as string}
            />
            <div className="col-span-12 flex justify-end gap-4">
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
