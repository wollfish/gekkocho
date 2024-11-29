'use client';

import React, { Suspense, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { Controller, useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { setPaymentMethod } from '@/actions/pay';
import { CryptoIcon } from '@/lib/misc/CryptoIcon';
import { convertCurrency } from '@/lib/utils';
import { PaymentMethodFormInterface, paymentMethodFormSchema, PaymentMethodInterface } from '@/lib/zod';

interface OwnProps {
    uuid: string;
    reqCurrency: string;
    reqAmount: string;
    methods: PaymentMethodInterface[];
}

export const PaymentMethodForm: React.FC<OwnProps> = (props) => {
    const { uuid, reqAmount, reqCurrency, methods } = props;

    const { handleSubmit, formState, control, watch } = useForm<PaymentMethodFormInterface>({
        resolver: zodResolver(paymentMethodFormSchema),
        defaultValues: {
            payment_id: String(uuid),
            pay_currency: '',
            pay_blockchain: '',
        },
    });

    const onSubmit = async (values: PaymentMethodFormInterface) => {
        const { error } = await setPaymentMethod(values) || {};

        toast.error(error);
    };

    const selectedCurrencyId = watch('pay_currency');
    const selectedCurrency = useMemo(() => methods.find((m) => m.id === selectedCurrencyId), [methods, selectedCurrencyId]);
    const convertedAmount = useMemo(() => {
        if (selectedCurrency) {
            return convertCurrency(methods, reqAmount, reqCurrency, selectedCurrency.id);
        }
    }, [methods, reqAmount, reqCurrency, selectedCurrency]);

    return (
        <form autoComplete="off" className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name="pay_currency"
                render={({ field, formState }) => (
                    <Select
                        errorMessage={formState.errors?.['pay_currency']?.message?.toString()}
                        isInvalid={!!formState.errors?.['pay_currency']?.message}
                        items={methods.filter((m) => m.currency_type === 'crypto')}
                        label="Select Currency"
                        labelPlacement="outside"
                        placeholder=" "
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
                description={`Conversion Rate: ${convertedAmount?.[1] || 0} ${reqCurrency.toUpperCase()}`}
                label="Converted Amount"
                labelPlacement="outside"
                placeholder=" "
                value={String(convertedAmount?.[0]) || ''}
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
