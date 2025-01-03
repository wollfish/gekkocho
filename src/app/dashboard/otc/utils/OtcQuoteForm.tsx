'use client';

import React, { Suspense, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { Controller, useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { createOtcOrderWithQuoteId, getOtcConversionRate } from '@/actions/dashboard/otc';
import { localeDate } from '@/lib/localeDate';
import { OtcQuoteFormInterface, otcQuoteFormSchema, OtcQuoteInterface } from '@/lib/zod';

const DEFAULT_MARKETS = [
    { id: 'usdtinr', name: 'USDT/INR' },
    { id: 'btcinr', name: 'BTC/INR' },
    { id: 'ethinr', name: 'ETH/INR' },
];

const DEFAULT_SIDES = [
    { id: 'buy', name: 'Buy' },
    { id: 'sell', name: 'Sell' },
];

export const OtcQuoteForm: React.FC = () => {
    const { handleSubmit, formState, control, reset } = useForm<OtcQuoteFormInterface>({
        resolver: zodResolver(otcQuoteFormSchema),
        defaultValues: {
            market: 'usdtinr',
            side: 'buy',
            req_amount: 0,
        },
    });

    const [otcQuote, setOtcQuote] = useState<OtcQuoteInterface>(null);
    const [otcCreateLoading, setOtcCreateLoading] = useState(false);

    const onSubmit = async (values: OtcQuoteFormInterface) => {
        const { success, data, error } = await getOtcConversionRate(values) || {};

        if (success) {
            setOtcQuote(data);
        } else {
            toast.error(error);
            setOtcQuote(null);
        }
    };

    const onOtcOrderCreate = async () => {
        setOtcCreateLoading(true);
        const { success, error } = await createOtcOrderWithQuoteId({ quote_id: String(otcQuote.quote_id) }) || {};

        setOtcCreateLoading(false);
        if (success) {
            toast.success('Order placed successfully');
            reset();
            setOtcQuote(null);
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
                    name="req_amount"
                    render={({ field, formState }) => (
                        <Input
                            autoComplete="off"
                            className="col-span-3"
                            errorMessage={formState.errors?.['req_amount']?.message?.toString()}
                            isInvalid={!!formState.errors?.['req_amount']?.message}
                            label="Requested Amount"
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
                        Calculate Quote Price
                    </Button>
                </Suspense>
            </div>
            {otcQuote?.quote_id && <div className="flex items-center gap-4 text-sm">
                <p className="col-span-2">Price: <b>{otcQuote.avg_price}</b></p>
                <p className="col-span-2">Expiry: <b>{localeDate(otcQuote.expired_at, 'fullDate')}</b></p>
                <Button
                    className="col-span-1"
                    color="secondary"
                    isDisabled={otcCreateLoading}
                    isLoading={otcCreateLoading}
                    size="sm"
                    type="reset"
                    variant="flat"
                    onPress={onOtcOrderCreate}
                >
                    Create an order for quote #{otcQuote?.quote_id}
                </Button>
            </div>}
        </form>
    );
};
