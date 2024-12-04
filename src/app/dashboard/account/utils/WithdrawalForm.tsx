'use client';

import React, { Suspense, useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Chip, ChipProps } from '@nextui-org/chip';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { useQuery } from '@tanstack/react-query';
import NextLink from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { doWithdrawal, getBeneficiaryList, getCurrencyList } from '@/actions/dashboard/account';
import { CryptoIcon } from '@/lib/misc/CryptoIcon';
import { InputOtp } from '@/lib/otpInput';
import { AccountResponseInterface, WithdrawalFormInterface, withdrawalFormSchema } from '@/lib/zod';

const statusColorMap: Record<string, ChipProps['color']> = {
    active: 'success',
    confirmed: 'success',
    pending: 'warning',
    vacation: 'warning',
    paused: 'danger',
    failed: 'danger',
    inactive: 'danger',
    aml_processing: 'warning',
};

interface OwnProps {
    selectedAccount: string;
    accounts: AccountResponseInterface[];
    onClose: () => void;
}

export const WithdrawalForm: React.FC<OwnProps> = (props) => {
    const { selectedAccount, accounts } = props;

    const { data: currencies, isLoading: currenciesLoading } = useQuery({
        queryKey: ['currencies'],
        queryFn: () => getCurrencyList(),
    });

    const { handleSubmit, formState, control, setValue, watch, reset } = useForm<WithdrawalFormInterface>({
        resolver: zodResolver(withdrawalFormSchema),
        defaultValues: {
            amount: '',
            otp: '',
            currency: selectedAccount || '',
            beneficiary_id: '',
            network: '',
            remarks: '',
        },
    });

    const selectedCurrency = watch('currency');
    const selectedNetwork = watch('network');

    const { data: beneficiaries, isLoading: beneficiariesLoading, isFetched: beneficiariesFetched } = useQuery({
        queryKey: ['beneficiaries', selectedCurrency, selectedNetwork],
        queryFn: () => getBeneficiaryList({ currency_id: selectedCurrency, blockchain_key: selectedNetwork }),
    });

    useEffect(() => {
        if (beneficiariesFetched) {
            setValue('beneficiary_id', '');
        }
    }, [beneficiariesFetched, setValue]);

    const availableBalance = useMemo(() => {
        return accounts?.find((acc) => acc.currency === selectedCurrency)?.balance || 0;
    }, [accounts, selectedCurrency]);

    const networks = useMemo(() => {
        return currencies?.data?.find((currency) => currency.id === selectedCurrency)?.networks || [];
    }, [currencies, selectedCurrency]);

    const onSubmit = async (values: WithdrawalFormInterface) => {
        const { error, success } = await doWithdrawal(values) || {};

        if (success) {
            toast.success('Withdrawal successful');
            reset();
            props.onClose();
        } else {
            toast.error(error);
        }
    };

    return (
        <form autoComplete="off" className="grid grid-cols-2 gap-4" method="POST" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-span-2 grid grid-cols-6 items-start gap-4">
                <Controller
                    control={control}
                    name="currency"
                    render={({ field, formState }) => {
                        return (
                            <Select
                                className="col-span-4"
                                disallowEmptySelection={false}
                                errorMessage={formState.errors?.['currency']?.message?.toString()}
                                isInvalid={!!formState.errors?.['currency']?.message}
                                items={accounts}
                                label="Currency"
                                labelPlacement="outside"
                                placeholder=" "
                                selectedKeys={[field.value]}
                                onChange={field.onChange}
                            >
                                {(account) => (
                                    <SelectItem
                                        key={account.currency}
                                        classNames={{ selectedIcon: 'hidden' }}
                                        startContent={<CryptoIcon code={account.currency}/>}
                                        value={account.currency}
                                    >
                                        {account.currency?.toUpperCase()}
                                    </SelectItem>
                                )}
                            </Select>
                        );
                    }}
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
                            isLoading={currenciesLoading}
                            items={networks || []}
                            label="Network"
                            labelPlacement="outside"
                            placeholder=" "
                            selectedKeys={[field.value]}
                            onChange={field.onChange}
                        >
                            {(network) => (
                                <SelectItem
                                    key={network.blockchain_key}
                                    classNames={{ selectedIcon: 'hidden' }}
                                    textValue={network.protocol || network.blockchain_key}
                                >
                                    {network.protocol || network.blockchain_key}
                                </SelectItem>
                            )}
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
                                    Balance: {availableBalance}
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
                name="beneficiary_id"
                render={({ field, formState }) => (
                    <Select
                        className="col-span-2"
                        description={beneficiaries?.data?.length ? ''
                            : <div>
                                <p className="text-tiny text-default-400">
                                    You don&apos;t have any beneficiaries for this currency or network.
                                    <NextLink className="text-primary" href="/dashboard/account/beneficiaries">
                                        &nbsp; add one
                                    </NextLink>
                                </p>
                            </div>
                        }
                        disallowEmptySelection={true}
                        errorMessage={formState.errors?.['beneficiary_id']?.message?.toString()}
                        isInvalid={!!formState.errors?.['beneficiary_id']?.message}
                        isLoading={beneficiariesLoading}
                        items={beneficiaries?.data || []}
                        label="Beneficiary"
                        labelPlacement="outside"
                        placeholder=" "
                        selectedKeys={[field.value]}
                        onChange={field.onChange}
                    >
                        {(beneficiary) => (
                            <SelectItem
                                key={beneficiary.id}
                                classNames={{ selectedIcon: 'hidden' }}
                                isDisabled={beneficiary.state !== 'active'}
                                textValue={beneficiary.name}
                            >
                                <div className="flex items-center gap-2">
                                    <CryptoIcon code={beneficiary.currency}/>
                                    <div className="flex flex-1 flex-col">
                                        <span className="flex justify-between text-small">
                                            {beneficiary.name} | {beneficiary.protocol}
                                            <Chip className="capitalize" color={statusColorMap[beneficiary.state]}
                                                size="sm" variant="light">
                                                {beneficiary.state}
                                            </Chip>
                                        </span>
                                        <span className="text-tiny text-default-400">
                                            {beneficiary.data?.address}
                                        </span>
                                    </div>
                                </div>
                            </SelectItem>
                        )}
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
            <Controller
                control={control}
                name="otp"
                render={({ field, formState }) => (
                    <InputOtp
                        classNames={{ base: 'w-full col-span-2' }}
                        color={!!formState.errors?.otp?.message ? 'danger' : 'default'}
                        description="Enter the code from your authenticator app. If you have not set up 2FA, please do so in the Settings section."
                        label="2FA Code"
                        otplength={6}
                        radius="lg"
                        variant="faded"
                        onFill={() => handleSubmit(onSubmit)()}
                        onInput={field.onChange}
                    />
                )}
            />
            <div className="col-span-2 flex justify-end gap-4">
                <Suspense>
                    <Button
                        variant="bordered"
                        onClick={() => {
                            reset();
                            setValue('currency', '');
                        }}
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
