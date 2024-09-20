'use server';

import { isRedirectError } from 'next/dist/client/components/redirect';

import { cookies } from 'next/headers';
import { AuthError } from 'next-auth';

import { signIn, signOut } from '@/auth';
import {
    AccountVerificationError,
    CustomError,
    ERROR_CODE_ACCOUNT_VERIFICATION_PENDING,
    InvalidCredentialsError,
    OtpInvalidError,
    OtpRequiredError,
} from '@/lib/errors';
import { SignInSchema, signInSchema, signUpSchema, SignUpSchema, UserInterface } from '@/lib/zod';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

export async function doLogin(formData: SignInSchema, callbackUrl = DEFAULT_LOGIN_REDIRECT) {
    try {
        const parsedCredentials = signInSchema.safeParse(formData);

        if (!parsedCredentials.success) {
            return {
                success: false,
                error: { message: parsedCredentials.error.message, details: parsedCredentials.error.errors },
            };
        }

        await signIn('credentials', {
            redirect: true,
            redirectTo: callbackUrl,
            email: parsedCredentials.data.email,
            otp: parsedCredentials.data.otp,
            password: parsedCredentials.data.password,
            remember: parsedCredentials.data.remember,
        });

        return { success: true, error: null };
    } catch (e: unknown) {
        if (isRedirectError(e)) throw e;
        const nextError = e as AuthError;
        const error = nextError.cause?.err as CustomError;

        if (error && (error instanceof InvalidCredentialsError
            || error instanceof OtpRequiredError
            || error instanceof AccountVerificationError
            || error instanceof OtpInvalidError
        )) {
            return { success: false, error: { message: error.message, code: error.code } };
        }

        return { success: false, error: { message: 'An unexpected error occurred.' } };
    }
}

export async function doRegister(formData: SignUpSchema, callbackUrl = DEFAULT_LOGIN_REDIRECT) {
    try {
        const parsedCredentials = signUpSchema.safeParse(formData);

        if (!parsedCredentials.success) {
            return {
                success: false,
                error: { message: parsedCredentials.error.message, details: parsedCredentials.error.errors },
            };
        }

        const { email, password, referral_code } = parsedCredentials.data;

        const payload = {
            email: email,
            password: password,
            data: JSON.stringify({ language: 'en' }),
            ...(!!referral_code && { refid: referral_code }),
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/barong/identity/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const resBody = await response.json();

        if (response.ok) {
            const user = resBody as UserInterface;

            if (user.state === 'pending') {
                return {
                    success: false,
                    error: {
                        message: 'Account verification is required',
                        code: ERROR_CODE_ACCOUNT_VERIFICATION_PENDING,
                    },
                };
            }

            await doLogin({ email, password, remember: false }, callbackUrl);
        }

        if (resBody.errors && Array.isArray(resBody.errors)) {
            if (resBody.errors.includes('identity.captcha.required')) {
                return { success: false, error: { message: 'Captcha is required' } };
            }
            if (resBody.errors.includes('email.taken')) {
                return { success: false, error: { message: 'Email is already taken' } };
            }

            return { success: false, error: { message: resBody.errors[0] } };
        }

    } catch (e: unknown) {
        if (isRedirectError(e)) throw e;

        return { success: false, error: { message: 'An unexpected error occurred.' } };
    }
}

export async function doLogout() {
    try {
        await signOut({ redirectTo: '/', redirect: true });
        cookies().delete('_barong_session');
    } catch (e: unknown) {
        if (isRedirectError(e)) throw e;
        console.error(e);

        return { success: false, error: { message: 'An unexpected error occurred.' } };
    }
}
