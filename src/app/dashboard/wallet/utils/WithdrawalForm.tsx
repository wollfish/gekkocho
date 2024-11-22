'use client';

import React, { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { Controller, useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { createWithdrawal } from '@/actions/dashboard/wallet';
import { Icons } from '@/components/icons';
import { WithdrawalFormInterface, withdrawalFormSchema } from '@/lib/zod';

interface OwnProps {
    onClose: () => void;
}

export const WithdrawalForm: React.FC<OwnProps> = (props) => {
    const { handleSubmit, formState, control, reset } = useForm<WithdrawalFormInterface>({
        resolver: zodResolver(withdrawalFormSchema),
        defaultValues: {
            address: '',
            currency: '',
            remarks: '',
            network: '',
            amount: null,
        },
    });

    const onSubmit = async (values: WithdrawalFormInterface) => {
        const { error, success } = await createWithdrawal(values) || {};

        if (success) {
            toast.success('Withdrawal added');
            reset();
            props.onClose();
        } else {
            toast.error(error?.message);
        }
    };

    return (
        <form autoComplete="off" className="grid grid-cols-2 gap-4" method="POST" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-span-2 grid grid-cols-6 items-start gap-4">
                <Controller
                    control={control}
                    name="currency"
                    render={({ field, formState }) => (
                        <Select
                            className="col-span-4"
                            disallowEmptySelection={true}
                            errorMessage={formState.errors?.['currency']?.message?.toString()}
                            isInvalid={!!formState.errors?.['currency']?.message}
                            label="Currency"
                            labelPlacement="outside"
                            placeholder=" "
                            value={field.value}
                            onChange={field.onChange}
                        >
                            <SelectItem
                                key="usd"
                                classNames={{ selectedIcon: 'hidden' }}
                                startContent={<Icons.usdt/>}
                            >
                                USDT
                            </SelectItem>
                            <SelectItem
                                key="btc"
                                classNames={{ selectedIcon: 'hidden' }}
                                startContent={<Icons.btc/>}
                            >
                                BTC
                            </SelectItem>
                            <SelectItem
                                key="eth"
                                classNames={{ selectedIcon: 'hidden' }}
                                startContent={<Icons.eth/>}
                            >
                                ETH
                            </SelectItem>
                        </Select>
                    )}
                />
                <Controller
                    control={control}
                    name="network"
                    render={({ field, formState }) => (
                        <Select
                            className="col-span-2"
                            disallowEmptySelection={true}
                            errorMessage={formState.errors?.['network']?.message?.toString()}
                            isInvalid={!!formState.errors?.['network']?.message}
                            label="Network"
                            labelPlacement="outside"
                            placeholder=" "
                            value={field.value}
                            onChange={field.onChange}
                        >
                            <SelectItem
                                key="tether"
                                classNames={{ selectedIcon: 'hidden' }}
                            >
                                Tether
                            </SelectItem>
                            <SelectItem
                                key="tron"
                                classNames={{ selectedIcon: 'hidden' }}
                            >
                                TRON
                            </SelectItem>
                            <SelectItem
                                key="ethereum"
                                classNames={{ selectedIcon: 'hidden' }}
                            >
                                Ethereum
                            </SelectItem>
                        </Select>
                    )}
                />
            </div>
            <Controller
                control={control}
                name="amount"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        className="col-span-2"
                        classNames={{ label: 'w-full' }}
                        errorMessage={formState.errors?.['amount']?.message?.toString()}
                        isInvalid={!!formState.errors?.['amount']?.message}
                        label={
                            <div className="flex items-center justify-between gap-1">
                                <span>Amount</span>
                                <span className="text-xs">
                                    Balance: 85766.08 USDT
                                </span>
                            </div>
                        }
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
                name="address"
                render={({ field, formState }) => (
                    <Select
                        className="col-span-2"
                        disallowEmptySelection={true}
                        errorMessage={formState.errors?.['address']?.message?.toString()}
                        isInvalid={!!formState.errors?.['address']?.message}
                        label="Address"
                        labelPlacement="outside"
                        placeholder=" "
                        value={field.value}
                        onChange={field.onChange}
                    >
                        <SelectItem
                            key="1MM67SnmHrRcuRtbQunU2HUkembjxuzrgD"
                            classNames={{ selectedIcon: 'hidden' }}
                            textValue="1MM67SnmHrRcuRtbQunU2HUkembjxuzrgD"
                        >
                            <div className="flex items-center gap-2">
                                <Icons.btc fill="orange" size={20}/>
                                <div className="flex flex-col">
                                    <span className="text-small">Beneficiary Nickname | BTC</span>
                                    <span className="text-tiny text-default-400">
                                        1MM67SnmHrRcuRtbQunU2HUkembjxuzrgD
                                    </span>
                                </div>
                            </div>
                        </SelectItem>
                        <SelectItem
                            key="0x8d12a197652b3cc77e6b353621db459e"
                            classNames={{ selectedIcon: 'hidden' }}
                            textValue="0x8d12a197652b3cc77e6b353621db459e"
                        >
                            <div className="flex items-center gap-2">
                                <Icons.ada fill="orange" size={20}/>
                                <div className="flex flex-col">
                                    <span className="text-small">Beneficiary Nickname | ADA</span>
                                    <span className="text-tiny text-default-400">
                                        0x8d12a197652b3cc77e6b353621db459e
                                    </span>
                                </div>
                            </div>
                        </SelectItem>
                        <SelectItem
                            key="0x9f8F72aA9304c8B593d555F12eF6589c"
                            classNames={{ selectedIcon: 'hidden' }}
                            textValue="0x9f8F72aA9304c8B593d555F12eF6589c"
                        >
                            <div className="flex items-center gap-2">
                                <Icons.polkadot fill="#ff0000" size={20}/>
                                <div className="flex flex-col">
                                    <span className="text-small">Beneficiary Nickname | Ethereum</span>
                                    <span className="text-tiny text-default-400">
                                        0x9f8F72aA9304c8B593d555F12eF6589c
                                    </span>
                                </div>
                            </div>
                        </SelectItem>
                    </Select>
                )}
            />
            <Controller
                control={control}
                name="remarks"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        className="col-span-2"
                        errorMessage={formState.errors?.['remarks']?.message?.toString()}
                        isInvalid={!!formState.errors?.['remarks']?.message}
                        label="Remarks (Optional)"
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
                        Withdraw
                    </Button>
                </Suspense>
            </div>
        </form>
    );
};
