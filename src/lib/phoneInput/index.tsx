'use client';

import React from 'react';
import { Avatar } from '@nextui-org/avatar';
import { Input } from '@nextui-org/input';
import { UseInputProps } from '@nextui-org/input/dist/use-input';
import { Select, SelectItem, UseSelectProps } from '@nextui-org/select';

import { Control, Controller } from 'react-hook-form';

import { COUNTRY_CODE_WITH_PHONE } from '@/constant';
import { ContactUsSchema } from '@/lib/zod';

interface OwnProps {
    selectProps?: UseSelectProps<never>;
    inputProps?: UseInputProps;
    control: Control<ContactUsSchema>;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, OwnProps>(({ ...props }, ref) => {
    return (
        <div className="flex grid-cols-4 items-start gap-1">
            <Controller
                control={props.control}
                name="phone_code"
                render={({ field, formState }) => (
                    <Select
                        aria-label="Phone Code"
                        className="w-32 shrink-0"
                        disallowEmptySelection={true}
                        errorMessage={formState.errors?.['phone_code']?.message?.toString()}
                        isInvalid={!!formState.errors?.['phone_code']?.message}
                        label="Contact Number"
                        labelPlacement="outside"
                        placeholder="+00"
                        selectionMode="single"
                        value={field.value}
                        onChange={field.onChange}
                        {...props.selectProps}
                    >
                        {COUNTRY_CODE_WITH_PHONE.map((country) => (
                            <SelectItem
                                key={country.code}
                                classNames={{ selectedIcon: 'hidden' }}
                                startContent={<Avatar alt={country.code} className="!size-6"
                                    src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}/>}
                                value={country.phone}
                            >
                                {country.phone}
                            </SelectItem>
                        ))}
                    </Select>
                )}
            />
            <Controller
                control={props.control}
                name="phone_number"
                render={({ field, formState }) => (
                    <Input
                        ref={ref}
                        aria-label="Phone Number"
                        autoComplete="off"
                        className="col-span-3"
                        errorMessage={formState.errors?.['phone_number']?.message?.toString()}
                        isInvalid={!!formState.errors?.['phone_number']?.message}
                        label=" "
                        labelPlacement="outside"
                        placeholder="123 456 7890"
                        type="tel"
                        value={field.value}
                        onChange={field.onChange}
                        {...props.inputProps}
                    />
                )}
            />
        </div>
    );
});
