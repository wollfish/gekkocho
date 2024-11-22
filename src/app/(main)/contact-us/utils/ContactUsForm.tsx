'use client';

import React, { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Checkbox, CheckboxGroup } from '@nextui-org/checkbox';
import { Input, Textarea } from '@nextui-org/input';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { doContactUs } from '@/actions/main';
import { contactUsOptions } from '@/config/site';
import { PhoneInput } from '@/lib/phoneInput';
import { ContactUsSchema, contactUsSchema } from '@/lib/zod';

export const ContactUsForm: React.FC = () => {
    const { handleSubmit, formState, control, reset } = useForm<ContactUsSchema>({
        resolver: zodResolver(contactUsSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            company_name: '',
            phone_code: '',
            phone_number: '',
            industry: [],
            message: '',
            website_url: '',
        },
    });

    const onSubmit = async (values: ContactUsSchema) => {
        const { success, error } = await doContactUs(values) || {};

        if (success) {
            toast.success('Thank you for contacting us');
            reset();
        } else {
            toast.error(error?.message);
        }
    };

    return (
        <form autoComplete="off" className="flex flex-col gap-6" method="POST" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name="first_name"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        errorMessage={formState.errors?.['first_name']?.message?.toString()}
                        isInvalid={!!formState.errors?.['first_name']?.message}
                        label="First Name"
                        labelPlacement="outside"
                        placeholder="Jhon"
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Controller
                control={control}
                name="last_name"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        errorMessage={formState.errors?.['last_name']?.message?.toString()}
                        isInvalid={!!formState.errors?.['last_name']?.message}
                        label="Last Name"
                        labelPlacement="outside"
                        placeholder="Doe"
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Controller
                control={control}
                name="email"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        errorMessage={formState.errors?.['email']?.message?.toString()}
                        isInvalid={!!formState.errors?.['email']?.message}
                        label="Email"
                        labelPlacement="outside"
                        placeholder="Jhon@doe.com"
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <PhoneInput control={control}/>
            <Controller
                control={control}
                name="company_name"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        errorMessage={formState.errors?.['company_name']?.message?.toString()}
                        isInvalid={!!formState.errors?.['company_name']?.message}
                        label="Company Name"
                        labelPlacement="outside"
                        placeholder="company name"
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Controller
                control={control}
                name="website_url"
                render={({ field, formState }) => (
                    <Input
                        autoComplete="off"
                        errorMessage={formState.errors?.['website_url']?.message?.toString()}
                        isInvalid={!!formState.errors?.['website_url']?.message}
                        label="Website URL (optional)"
                        labelPlacement="outside"
                        placeholder="example.com"
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Controller
                control={control}
                name="industry"
                render={({ field, formState }) => (
                    <CheckboxGroup
                        classNames={{ label: 'text-foreground' }}
                        errorMessage={formState.errors?.['industry']?.message?.toString()}
                        isInvalid={!!formState.errors?.['industry']?.message}
                        label="Industry"
                        value={field.value}
                        onValueChange={field.onChange}
                    >
                        {contactUsOptions.industry.map((item) => (
                            <Checkbox key={item.value} size="sm" value={item.value}>
                                {item.label}
                            </Checkbox>
                        ))}
                    </CheckboxGroup>
                )}
            />
            <Controller
                control={control}
                name="message"
                render={({ field, formState }) => (
                    <Textarea
                        autoComplete="off"
                        errorMessage={formState.errors?.['message']?.message?.toString()}
                        isInvalid={!!formState.errors?.['message']?.message}
                        label="Message"
                        labelPlacement="outside"
                        minRows={3}
                        placeholder="Describe your message"
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Suspense>
                <Button
                    color="primary"
                    disabled={formState.isSubmitting}
                    isLoading={formState.isSubmitting}
                    type="submit"
                >
                    Contact Us
                </Button>
            </Suspense>
        </form>
    );
};
