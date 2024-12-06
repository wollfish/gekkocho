'use client';

import React, { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { Controller, useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { addNewFiatBeneficiary } from '@/actions/dashboard/account';
import { CryptoIcon } from '@/lib/misc/CryptoIcon';
import { beneficiaryFiatFormSchema, BeneficiaryFormFiatInterface, CurrencyResponseInterface } from '@/lib/zod';

interface OwnProps {
    onClose: () => void;
    currencies: CurrencyResponseInterface[];
}

export const BeneficiaryFiatForm: React.FC<OwnProps> = (props) => {
    const { handleSubmit, formState, control, reset } = useForm<BeneficiaryFormFiatInterface>({
        resolver: zodResolver(beneficiaryFiatFormSchema),
        defaultValues: {
            currency: '',
            nick_name: '',
            blockchain_key: 'lightning-blockchain',
            full_name: '',
            account_type: 'savings',
            account_number: '',
            bank_ifsc_code: '',
        },
    });

    const onSubmit = async (values: BeneficiaryFormFiatInterface) => {
        const { error, success } = await addNewFiatBeneficiary(values) || {};

        if (success) {
            toast.success('Account added successfully, please verify through email');
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
                name="nick_name"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        className="col-span-2"
                        errorMessage={formState.errors?.['nick_name']?.message?.toString()}
                        isInvalid={!!formState.errors?.['nick_name']?.message}
                        label="Nick Name"
                        labelPlacement="outside"
                        placeholder="Nick name to remember your account"
                        type="text"
                        value={String(field.value)}
                        onChange={field.onChange}
                    />
                )}
            />
            <Controller
                control={control}
                name="currency"
                render={({ field, formState }) => (
                    <Select
                        className="col-span-2"
                        disallowEmptySelection={true}
                        errorMessage={formState.errors?.['currency']?.message?.toString()}
                        isInvalid={!!formState.errors?.['currency']?.message}
                        label="Currency"
                        labelPlacement="outside"
                        placeholder="Choose a currency"
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
                name="full_name"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        className="col-span-2"
                        errorMessage={formState.errors?.['full_name']?.message?.toString()}
                        isInvalid={!!formState.errors?.['full_name']?.message}
                        label="Account Holder Name"
                        labelPlacement="outside"
                        placeholder=" "
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Controller
                control={control}
                name="account_number"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        className="col-span-2"
                        errorMessage={formState.errors?.['account_number']?.message?.toString()}
                        isInvalid={!!formState.errors?.['account_number']?.message}
                        label="Account Number"
                        labelPlacement="outside"
                        placeholder=" "
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Controller
                control={control}
                name="bank_ifsc_code"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        className="col-span-2"
                        errorMessage={formState.errors?.['bank_ifsc_code']?.message?.toString()}
                        isInvalid={!!formState.errors?.['bank_ifsc_code']?.message}
                        label="Bank IFSC Code"
                        labelPlacement="outside"
                        placeholder=" "
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
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
                        Submit Account Details
                    </Button>
                </Suspense>
            </div>
        </form>
    );
};
