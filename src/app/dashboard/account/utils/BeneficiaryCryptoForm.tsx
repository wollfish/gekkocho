'use client';

import React, { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { Controller, useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { addNewCryptoBeneficiary } from '@/actions/dashboard/account';
import { CryptoIcon } from '@/lib/misc/CryptoIcon';
import { BeneficiaryFormCryptoInterface, beneficiaryCryptoFormSchema, CurrencyResponseInterface } from '@/lib/zod';

interface OwnProps {
    onClose: () => void;
    currencies: CurrencyResponseInterface[];
}

export const BeneficiaryCryptoForm: React.FC<OwnProps> = (props) => {
    const { handleSubmit, formState, control, reset, watch } = useForm<BeneficiaryFormCryptoInterface>({
        resolver: zodResolver(beneficiaryCryptoFormSchema),
        defaultValues: {
            address: '',
            currency: '',
            description: '',
            network: '',
            name: '',
        },
    });

    const onSubmit = async (values: BeneficiaryFormCryptoInterface) => {
        const { error, success } = await addNewCryptoBeneficiary(values) || {};

        if (success) {
            toast.success('Crypto account added, please verify through email');
            reset();
            props.onClose();
        } else {
            toast.error(error);
        }
    };

    return (
        <form autoComplete="off" className="grid grid-cols-2 gap-4" method="POST" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name="name"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        className="col-span-2"
                        errorMessage={formState.errors?.['name']?.message?.toString()}
                        isInvalid={!!formState.errors?.['name']?.message}
                        label="Nick Name"
                        labelPlacement="outside"
                        placeholder="Nick name to identify the account"
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
                            {props.currencies.map((currency) => (
                                <SelectItem
                                    key={currency.id}
                                    classNames={{ selectedIcon: 'hidden' }}
                                    startContent={<CryptoIcon code={currency.id}/>}
                                >
                                    {currency.id.toUpperCase()}
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
                            className="col-span-2"
                            disallowEmptySelection={false}
                            errorMessage={formState.errors?.['network']?.message?.toString()}
                            isInvalid={!!formState.errors?.['network']?.message}
                            label="Network"
                            labelPlacement="outside"
                            placeholder=" "
                            value={field.value}
                            onChange={field.onChange}
                        >
                            {props.currencies.find((currency) => currency.id === watch()?.currency)?.networks.map((network) => (
                                <SelectItem
                                    key={network.blockchain_key}
                                    classNames={{ selectedIcon: 'hidden' }}
                                >
                                    {network.protocol || network.blockchain_key}
                                </SelectItem>
                            ))}
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
