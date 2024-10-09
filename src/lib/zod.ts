import { z } from 'zod';

export const signInSchema = z.object({
    email: z.string({ required_error: 'Email is required' })
        .min(1, 'Email is required')
        .email('Invalid email'),
    password: z.string({ required_error: 'Password is required' })
        .min(1, 'Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
    otp: z.string()
        .min(0)
        .max(6, 'OTP must be 6 characters')
        .optional(),
    remember: z.union([z.boolean(), z.string()]).optional().transform((val) => {
        if (typeof val === 'string') {
            return val === 'true';
        }

        return val;
    }),
});

export const signUpSchema = z.object({
    email: z.string({ required_error: 'Email is required' })
        .min(1, 'Email is required')
        .email('Invalid email'),
    password: z.string({ required_error: 'Password is required' })
        .min(1, 'Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
    confirm_password: z.string({ required_error: 'Confirm password is required' })
        .min(1, 'Confirm password is required')
        .min(8, 'Confirm password must be more than 8 characters')
        .max(32, 'Confirm password must be less than 32 characters'),
    terms: z.union([z.boolean(), z.string()]).transform((val) => {
        if (typeof val === 'string') {
            return val === 'true';
        }

        return val;
    }),
    referral_code: z.string().optional(),
}).refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords do not match',
}).refine((data) => data.terms === true, {
    path: ['terms'],
    message: 'You must accept the terms and conditions',
});

export const LabelSchema = z.object({
    key: z.string(),
    value: z.string(),
    scope: z.string(),
});

export const PhoneSchema = z.object({
    id: z.number(),
    country: z.string(),
    number: z.string(),
    validated_at: z.date().nullable(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export const ProfileSchema = z.object({
    id: z.number(),
    first_name: z.string(),
    last_name: z.string(),
    full_name: z.string(),
    dob: z.coerce.date(),
    address: z.string(),
    postcode: z.string(),
    city: z.string(),
    country: z.string(),
    state: z.string(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export const UserSchema = z.object({
    email: z.string().email(),
    uid: z.string(),
    role: z.string(),
    level: z.number(),
    otp: z.boolean(),
    state: z.string(),
    csrf_token: z.string().optional(),
    referral_uid: z.string().nullable(),
    data: z.string(),
    username: z.string().nullable(),
    access_token: z.object({
        value: z.string(),
        name: z.string(),
        expires_at: z.coerce.date(),
    }).optional(),
    labels: z.array(LabelSchema),
    phones: z.array(PhoneSchema),
    profiles: z.array(ProfileSchema),
    data_storages: z.array(z.any()),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export const paymentFormSchema = z.object({
    order_id: z.string().optional(),
    order_amount: z.coerce
        .number({ required_error: 'Order amount is required' })
        .gt(0, 'Order amount must be greater than 0'),
    order_currency: z.string({ required_error: 'Order currency is required' })
        .min(1, 'Order currency is required'),
    order_currency_type: z.enum(['fiat', 'crypto']),
    order_description: z.string().optional(),
    redirect_url: z.string().optional(),
});

export const paymentMethodFormSchema = z.object({
    uuid: z.string({ required_error: 'Payment method is required' }).min(1, 'Payment method is required'),
    currency: z.string({ required_error: 'Currency is required' }).min(1, 'Currency is required'),
    network: z.string({ required_error: 'Network is required' }).min(1, 'Network is required'),
});

export const paymentResponseSchema = z.object({
    uuid: z.string(),
    order_id: z.string(),
    amount: z.string(),
    currency: z.string(),
    currency_type: z.string(),
    payer_amount: z.string().nullable(),
    payer_amount_fiat: z.string().nullable(),
    payer_currency: z.string().nullable(),
    network: z.string().nullable(),
    payment_amount: z.string().nullable(),
    remains_amount: z.string().nullable(),
    remains_amount_fiat: z.string().nullable(),
    fee_amount: z.string().nullable(),
    desc: z.string().nullable(),
    address: z.string(),
    from: z.string().nullable(),
    txid: z.string().nullable(),
    payment_status: z.string(),
    expired_at: z.coerce.date(),
    created_at: z.coerce.date(),
    status: z.string(),
    return_url: z.string().nullable(),
    confirms: z.number(),
    need_confirms: z.number(),
    block: z.number(),
});

export const paymentMethodSchema = z.object({
    amount: z.string(),
    real_amount: z.string(),
    exchange_rate: z.string(),
    discount: z.number(),
    discount_percent: z.number(),
    currency: z.string(),
    currency_icon: z.string(),
    network: z.string(),
    token_standard: z.string(),
    is_popular_choice: z.boolean(),
    min_amount: z.string(),
    status: z.string(),
});

export type LabelInterface = z.infer<typeof LabelSchema>;
export type PaymentFormInterface = z.infer<typeof paymentFormSchema>;
export type PaymentMethodFormInterface = z.infer<typeof paymentMethodFormSchema>;
export type PaymentResponseInterface = z.infer<typeof paymentResponseSchema>;
export type PaymentMethodInterface = z.infer<typeof paymentMethodSchema>;
export type PhoneInterface = z.infer<typeof PhoneSchema>;
export type ProfileInterface = z.infer<typeof ProfileSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
export type UserInterface = z.infer<typeof UserSchema>;
