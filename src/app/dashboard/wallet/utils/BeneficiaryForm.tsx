'use client';

import React, { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { Controller, useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { addNewBeneficiary } from '@/actions/dashboard/wallet';
import { Icons } from '@/components/icons';
import { BeneficiaryFormInterface, beneficiaryFormSchema } from '@/lib/zod';

interface OwnProps {
    onClose: () => void;
}

export const BeneficiaryForm: React.FC<OwnProps> = (props) => {
    const { handleSubmit, formState, control, reset } = useForm<BeneficiaryFormInterface>({
        resolver: zodResolver(beneficiaryFormSchema),
        defaultValues: {
            address: '',
            currency: '',
            description: '',
            network: '',
            nickname: '',
        },
    });

    const onSubmit = async (values: BeneficiaryFormInterface) => {
        const { error, success } = await addNewBeneficiary(values) || {};

        if (success) {
            toast.success('Beneficiary added');
            reset();
            props.onClose();
        } else {
            toast.error(error?.message);
        }
    };

    return (
        <form autoComplete="off" className="grid grid-cols-2 gap-4" method="POST" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name="nickname"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        className="col-span-2"
                        errorMessage={formState.errors?.['nickname']?.message?.toString()}
                        isInvalid={!!formState.errors?.['nickname']?.message}
                        label="Nickname"
                        labelPlacement="outside"
                        placeholder=" "
                        type="text"
                        value={String(field.value)}
                        onChange={field.onChange}
                    />
                )}
            />
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
                name="address"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        className="col-span-2"
                        errorMessage={formState.errors?.['address']?.message?.toString()}
                        isInvalid={!!formState.errors?.['address']?.message}
                        label="Address"
                        labelPlacement="outside"
                        placeholder=" "
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Controller
                control={control}
                name="description"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        className="col-span-2"
                        errorMessage={formState.errors?.['description']?.message?.toString()}
                        isInvalid={!!formState.errors?.['description']?.message}
                        label="Description (Optional)"
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
                        Create Beneficiary
                    </Button>
                </Suspense>
            </div>
        </form>
    );
};
