'use client';

import React, { Suspense, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { toast } from 'sonner';

import { setPaymentMethod } from '@/actions/dashboard/payment';
import { subtitle } from '@/components/primitives';
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

    const defaultValues = useMemo(() => ({
        payment_id: String(uuid),
        pay_currency: payment.pay_currency || '',
        pay_blockchain: payment.pay_blockchain || '',
        customer_name: payment.customer?.name || '',
        customer_email: payment.customer?.email || '',
    }), [uuid, payment]);

    const { handleSubmit, formState, control, setValue } = useForm<PaymentMethodFormInterface>({
        resolver: zodResolver(paymentMethodFormSchema),
        defaultValues,
    });

    const watchCurrency = useWatch({ control, name: 'pay_currency' });

    const selectedCurrency = useMemo(() => methods.find((m) => m.id === watchCurrency), [methods, watchCurrency]);

    const convertedAmount = useMemo(() => {
        return selectedCurrency
            ? convertCurrency(methods, payment.req_amount, payment.req_currency, selectedCurrency.id)
            : 0;
    }, [selectedCurrency, methods, payment]);

    const onSubmit = async (values: PaymentMethodFormInterface) => {
        const { error, success } = await setPaymentMethod(values);

        if (success) {
            toast.success('Payment method set');
        } else {
            toast.error(error || 'Something went wrong');
        }
    };

    return (
        <form autoComplete="off" className="grid w-full grid-cols-12 gap-4" onSubmit={handleSubmit(onSubmit)}>
            <h3 className={subtitle({ className: 'col-span-12' })}>Fill your Information</h3>
            {['customer_name', 'customer_email'].map((field_name) => (
                <Controller
                    key={field_name}
                    control={control}
                    name={field_name as keyof PaymentMethodFormInterface}
                    render={({ field, formState }) => (
                        <Input
                            autoComplete="off"
                            className="col-span-12 capitalize"
                            errorMessage={formState.errors?.[field_name]?.message?.toString()}
                            isDisabled={!!defaultValues[field_name]}
                            isInvalid={!!formState.errors?.[field_name]?.message}
                            label={field_name.split('_')[1]}
                            labelPlacement="outside"
                            placeholder={`Enter your ${field_name.split('_')[1]}`}
                            {...field}
                        />
                    )}
                />
            ))}
            <Divider className="col-span-12 mt-4"/>
            <h3 className={subtitle({ className: 'col-span-12' })}>Choose a payment method</h3>
            <div className="col-span-12 grid grid-cols-12 items-start gap-4">
                <Controller
                    control={control}
                    name="pay_currency"
                    render={({ field, formState }) => (
                        <Select
                            className="col-span-7"
                            disallowEmptySelection={true}
                            errorMessage={formState.errors?.['pay_currency']?.message?.toString()}
                            isDisabled={!!defaultValues['pay_currency']}
                            isInvalid={!!formState.errors?.['pay_currency']?.message}
                            items={methods.filter((m) => m.currency_type === 'coin')}
                            label="Select Currency"
                            labelPlacement="outside"
                            placeholder="Pick a currency"
                            selectedKeys={[field.value]}
                            onChange={(key) => {
                                field.onChange(key);
                                setValue('pay_blockchain', '');
                            }}
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
                            isDisabled={!!defaultValues.pay_blockchain}
                            isInvalid={!!formState.errors?.['pay_blockchain']?.message}
                            items={selectedCurrency?.networks || []}
                            label="Select Network"
                            labelPlacement="outside"
                            placeholder="Select Network"
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
            </div>
            <Input
                className="col-span-12"
                description={
                    <p className="font-medium">
                        <span>Conversion Rate: &nbsp;</span>
                        {selectedCurrency?.id && <span className="font-semibold uppercase text-secondary">
                            {`1 ${selectedCurrency?.id} = ${(convertedAmount?.[1])?.toFixed(2)} ${payment?.req_currency}`}
                        </span>}
                    </p>
                }
                isReadOnly={true}
                label="Converted Amount"
                labelPlacement="outside"
                placeholder="Converted Amount..."
                value={`${convertedAmount?.[0] || ''} ${watchCurrency?.toUpperCase() || ''}`}
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
