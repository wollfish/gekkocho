import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { AccountVerificationError, InvalidCredentialsError, OtpInvalidError, OtpRequiredError } from '@/lib/errors';
import { setAuthCookie } from '@/lib/server-utils';
import { SignInSchema } from '@/lib/zod';

export const authConfig: NextAuthConfig = {
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
                remember: { label: 'Remember', type: 'boolean' },
            },
            async authorize(credentials: SignInSchema) {
                // return {
                //     id: '23232',
                //     email: credentials.email,
                //     name: 'John Doe',
                //     image: '',
                // } as User;

                const payload = {
                    email: credentials.email,
                    password: credentials.password,
                    ...(!!credentials.otp && { otp_code: credentials.otp }),
                };

                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/barong/identity/sessions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const resBody = await res.json();

                if (res.ok) {
                    setAuthCookie(res.headers.get('set-cookie'));

                    return resBody;
                } else if (resBody.errors && Array.isArray(resBody.errors)) {
                    if (resBody.errors.includes('identity.session.missing_otp')) {
                        throw new OtpRequiredError(resBody.errors);
                    }
                    if (resBody.errors.includes('identity.session.invalid_otp')) {
                        throw new OtpInvalidError(resBody.errors);
                    }
                    if (resBody.errors.includes('identity.session.not_active')) {
                        throw new AccountVerificationError(resBody.errors);
                    }
                    throw new InvalidCredentialsError(resBody.errors);
                } else {
                    throw new InvalidCredentialsError();
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }

            // console.log('===============Callback JWT|auth.ts==================');
            // console.log('token', token);
            // console.log('user', user);

            return token;
        },
        async session({ session, token }) {
            // session.user = token.user;

            // console.log('===============Callback session|auth.ts==================');
            // console.log('session', session);
            // console.log('token', token);
            // console.log('===============End|auth.ts==================');

            return session;
        },
    },
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: '/login',
        signOut: '/auth/signout',
    },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
