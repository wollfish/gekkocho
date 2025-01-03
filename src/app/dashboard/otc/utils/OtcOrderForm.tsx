'use client';

import React, { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { Controller, useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { createOtcOrder } from '@/actions/dashboard/otc';
import { OtcOrderFormInterface, otcOrderFormSchema } from '@/lib/zod';

const DEFAULT_MARKETS = [
    { id: 'usdtinr', name: 'USDT/INR' },
    { id: 'btcinr', name: 'BTC/INR' },
    { id: 'ethinr', name: 'ETH/INR' },
];

const DEFAULT_SIDES = [
    { id: 'buy', name: 'Buy' },
    { id: 'sell', name: 'Sell' },
];

export const OtcOrderForm: React.FC = () => {
    const { handleSubmit, formState, control, reset } = useForm<OtcOrderFormInterface>({
        resolver: zodResolver(otcOrderFormSchema),
        defaultValues: {
            market: 'usdtinr',
            side: 'buy',
            amount: 0,
        },
    });

    const onSubmit = async (values: OtcOrderFormInterface) => {
        const { success, error } = await createOtcOrder(values) || {};

        if (success) {
            toast.success('Order placed successfully');
            reset();
        } else {
            toast.error(error);
        }
    };

    return (
        <form autoComplete="off" className="flex flex-col gap-4" method="POST" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-span-2 grid grid-cols-6 items-start  gap-4 xl:grid-cols-12">
                <Controller
                    control={control}
                    name="market"
                    render={({ field, formState }) => (
                        <Select
                            className="col-span-2"
                            errorMessage={formState.errors?.['market']?.message?.toString()}
                            isInvalid={!!formState.errors?.['market']?.message}
                            items={DEFAULT_MARKETS}
                            label="Market"
                            labelPlacement="outside"
                            placeholder=" "
                            selectedKeys={[field.value]}
                            onChange={field.onChange}
                        >
                            {(v) => (
                                <SelectItem key={v.id} textValue={v.name?.toUpperCase()}>
                                    {v.name?.toUpperCase()}
                                </SelectItem>
                            )}
                        </Select>
                    )}
                />
                <Controller
                    control={control}
                    name="side"
                    render={({ field, formState }) => (
                        <Select
                            className="col-span-2"
                            errorMessage={formState.errors?.['side']?.message?.toString()}
                            isInvalid={!!formState.errors?.['side']?.message}
                            items={DEFAULT_SIDES}
                            label="Side"
                            labelPlacement="outside"
                            placeholder=" "
                            selectedKeys={[field.value]}
                            onChange={field.onChange}
                        >
                            {(v) => (
                                <SelectItem key={v.id} textValue={v.name?.toUpperCase()}>
                                    {v.name?.toUpperCase()}
                                </SelectItem>
                            )}
                        </Select>
                    )}
                />
                <Controller
                    control={control}
                    name="amount"
                    render={({ field, formState }) => (
                        <Input
                            autoComplete="off"
                            className="col-span-3"
                            errorMessage={formState.errors?.['amount']?.message?.toString()}
                            isInvalid={!!formState.errors?.['amount']?.message}
                            label="Order Amount"
                            labelPlacement="outside"
                            placeholder=" "
                            value={String(field.value)}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Suspense>
                    <Button
                        className="col-span-2 mt-6"
                        color="primary"
                        isDisabled={formState.isSubmitting}
                        isLoading={formState.isSubmitting}
                        type="submit"
                        variant="flat"
                    >
                        Create an OTC Order
                    </Button>
                    <Button
                        className="col-span-1 mt-6"
                        color="secondary"
                        isDisabled={formState.isSubmitting}
                        type="reset"
                        variant="flat"
                        onPress={() => reset()}
                    >
                        Reset
                    </Button>
                </Suspense>
            </div>
        </form>
    );
};
