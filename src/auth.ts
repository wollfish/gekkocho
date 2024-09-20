import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { CommonAuthError, errorMap } from '@/lib/errors';
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

                if (!res.ok) {
                    console.error(resBody);

                    if (resBody.errors?.length) {
                        resBody.errors.forEach((error: string) => {
                            if (errorMap[error]) {
                                throw new errorMap[error](resBody.errors);
                            }
                        });

                        throw new CommonAuthError(resBody.errors);
                    }

                    throw new CommonAuthError();
                }

                setAuthCookie(res.headers.get('set-cookie'));

                return resBody;
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
