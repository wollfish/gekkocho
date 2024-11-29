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

export const contactUsSchema = z.object({
    first_name: z.string({ required_error: 'First name is required' })
        .min(1, 'First name is required')
        .max(50, 'First name must be less than 50 characters'),
    last_name: z.string({ required_error: 'Last name is required' })
        .min(1, 'Last name is required')
        .max(50, 'Last name must be less than 50 characters'),
    email: z.string({ required_error: 'Email is required' })
        .min(1, 'Email is required')
        .email('Invalid email'),
    phone_code: z.string({ required_error: 'Phone code is required' })
        .min(1, 'Phone code is required')
        .max(5, 'Invalid phone code'),
    phone_number: z.string({ required_error: 'Phone number is required' })
        .min(8, 'Phone number is required')
        .max(15, 'Phone number must be less than 15 characters')
        .regex(/^[0-9]+$/, 'Invalid phone number'),
    company_name: z.string({ required_error: 'Company name is required' })
        .min(1, 'Company name is required')
        .max(50, 'Company name must be less than 50 characters'),
    industry: z.array(z.string())
        .min(1, 'Industry is required'),
    message: z.string({ required_error: 'Message is required' })
        .min(1, 'Message is required')
        .max(500, 'Message must be less than 500 characters'),
    website_url: z.string().optional(),
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

export const twoFactorAuthFormSchema = z.object({
    code: z.string({ required_error: 'Code is required' })
        .min(1, 'Code is required')
        .max(6, 'Code must be less than 6 characters'),
    status: z.enum(['enable', 'disable']),
}).refine((data) => data.code.length === 6, {
    path: ['code'],
    message: 'Code must be 6 characters',
});

// req_currency
// req_amount
// reference_id [-, 0-9, A-Z, a-z]
// pay_currency?
// pay_blockchain?
// redirect_url?
export const paymentFormSchema = z.object({
    reference_id: z.string({ required_error: 'Reference id is required' })
        .min(8, 'Reference id should be at least 8 characters')
        .max(64, 'Reference id must be less than 64 characters'),
    req_amount: z.coerce
        .number({ required_error: 'Order amount is required' })
        .gt(0, 'Order amount must be greater than 0'),
    req_currency: z.string({ required_error: 'Order currency is required' })
        .min(1, 'Order currency is required'),
    redirect_url: z.string().optional(),
});
export const paymentMethodFormSchema = z.object({
    payment_id: z.string({ required_error: 'Payment method is required' }).min(1, 'Payment method is required'),
    pay_currency: z.string({ required_error: 'Currency is required' }).min(1, 'Currency is required'),
    pay_blockchain: z.string({ required_error: 'Network is required' }).min(1, 'Network is required'),
});

export const paymentResponseSchemaV1 = z.object({
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

export const paymentResponseSchema = z.object({
    id: z.string(),
    req_currency: z.string(),
    pay_currency: z.string().nullable(),
    pay_blockchain: z.string().nullable(),
    exchange_rate: z.string().nullable(),
    req_amount: z.string(),
    pay_amount: z.string().nullable(),
    address: z.string().nullable(),
    txid: z.string().nullable(),
    reference_id: z.string(),
    redirect_url: z.string().nullable(),
    state: z.string(),
    created_at: z.coerce.date(),
    initiated_at: z.coerce.date().nullable(),
    expired_at: z.coerce.date().nullable(),
});

export const accountResponseInterface = z.object({
    currency: z.string(),
    balance: z.string(),
    locked: z.string(),
    escrow: z.string(),
    wallet_type: z.string(),
});

export const beneficiaryFormSchema = z.object({
    name: z.string({ required_error: 'Name is required' })
        .min(1, 'Nickname is required')
        .max(30, 'Nickname must be less than 30 characters'),
    currency: z.string({ required_error: 'Currency is required' })
        .min(1, 'Currency is required'),
    address: z.string({ required_error: 'Address is required' })
        .min(1, 'Address is required'),
    network: z.string({ required_error: 'Network is required' })
        .min(1, 'Network is required'),
    description: z.string().optional(),
});

export const beneficiaryActivationFromSchema = z.object({
    id: z.string({ required_error: 'Id is required' })
        .min(1, 'Id is required')
        .max(30, 'Id must be less than 30 characters'),
    pin: z.string({ required_error: 'Otp is required' })
        .min(1, 'Otp is required')
        .max(6, 'Otp must be less than 6 characters'),
}).refine((data) => data.pin.length === 6, {
    message: 'Otp must be 6 characters',
    path: ['pin'],
});

export const beneficiarySchema = z.object({
    id: z.string(),
    state: z.string(),
    name: z.string(),
    currency: z.string(),
    data: z.object({
        address: z.string(),
    }),
    blockchain_key: z.string(),
    protocol: z.string(),
    description: z.string(),
});

export const withdrawalFormSchema = z.object({
    currency: z.string({ required_error: 'Currency is required' })
        .min(1, 'Currency is required'),
    amount: z.string({ required_error: 'Amount is required' })
        .min(1, 'Amount is required'),
    otp: z.string()
        .min(1, 'OTP is required')
        .max(6, 'OTP must be 6 characters'),
    network: z.string({ required_error: 'Network is required' })
        .min(1, 'Network is required'),
    beneficiary_id: z.string({ required_error: 'Network is required' })
        .min(1, 'Network is required'),
    remarks: z.string().optional(),
}).refine((data) => +data.amount > 0, {
    message: 'Amount must be greater than 0',
    path: ['amount'],
}).refine((data) => data.otp.length === 6, {
    message: 'OTP must be 6 characters',
    path: ['otp'],
});

export const withdrawalSchema = z.object({
    id: z.number(),
    currency: z.string(),
    blockchain_key: z.string(),
    explorer_address: z.string(),
    explorer_transaction: z.string(),
    protocol: z.string(),
    amount: z.string(),
    fee: z.string(),
    note: z.string(),
    rid: z.string(),
    confirmations: z.number(),
    state: z.string(),
    type: z.string(),
    tid: z.string(),
    txid: z.string().nullable(),
    completed_at: z.coerce.date().nullable(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date().nullable(),
});

export const networkSchema = z.object({
    id: z.string(),
    status: z.string(),
    blockchain_key: z.string(),
    protocol: z.string(),
    deposit_fee: z.string(),
    withdraw_fee: z.string(),
    min_deposit_amount: z.string(),
    min_withdraw_amount: z.string(),
});

export const currencyResponseSchema = z.object({
    id: z.string(),
    status: z.string(),
    name: z.string(),
    price: z.string(),
    type: z.string(),
    precision: z.number(),
    icon_url: z.string(),
    networks: z.array(networkSchema),
});

//pay_currency
//pay_blockchain

export const paymentMethodSchema = z.object({
    id: z.string(),
    exchange_rate: z.string(),
    currency_name: z.string(),
    currency_type: z.string(),
    currency_icon: z.string(),
    networks: z.array(networkSchema),
    status: z.string(),
});

export type PaymentFormInterface = z.infer<typeof paymentFormSchema>;
export type PaymentMethodFormInterface = z.infer<typeof paymentMethodFormSchema>;
export type BeneficiaryFormInterface = z.infer<typeof beneficiaryFormSchema>;
export type BeneficiaryInterface = z.infer<typeof beneficiarySchema>;
export type BeneficiaryActivationFormInterface = z.infer<typeof beneficiaryActivationFromSchema>;
export type WithdrawalInterface = z.infer<typeof withdrawalSchema>;
export type WithdrawalFormInterface = z.infer<typeof withdrawalFormSchema>;

export type PaymentResponseInterface = z.infer<typeof paymentResponseSchema>;
export type PaymentMethodInterface = z.infer<typeof paymentMethodSchema>;

export type AccountResponseInterface = z.infer<typeof accountResponseInterface>;
export type NetworkInterface = z.infer<typeof networkSchema>;
export type CurrencyResponseInterface = z.infer<typeof currencyResponseSchema>;

export type LabelInterface = z.infer<typeof LabelSchema>;
export type PhoneInterface = z.infer<typeof PhoneSchema>;
export type ProfileInterface = z.infer<typeof ProfileSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
export type UserInterface = z.infer<typeof UserSchema>;
export type ContactUsSchema = z.infer<typeof contactUsSchema>;

export type TwoFactorAuthFormInterface = z.infer<typeof twoFactorAuthFormSchema>;
