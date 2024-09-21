import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { CommonAuthError, errorMap } from '@/lib/errors';
import { getAccessTokenFromHeader } from '@/lib/server-utils';
import { SignInSchema, UserInterface } from '@/lib/zod';

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
                    console.warn(resBody);

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

                const tokenObj = getAccessTokenFromHeader(res.headers.get('set-cookie'), '_barong_session');

                if (!tokenObj) {
                    throw new CommonAuthError(['Access token not found.']);
                }

                return { ...resBody, access_token: tokenObj };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: any; user: UserInterface | undefined }) {
            if (user) {
                return {
                    ...token,
                    id: user.uid,
                    email: user.email,
                    access_token: user.access_token.value,
                    access_token_expiry: String(user.access_token.expires_at),
                    csrf_token: user.csrf_token,
                    name: user.profiles?.length && user.profiles[0]?.full_name || user.username || 'N/A',
                };
            }

            // console.log('===============Callback JWT|auth.ts==================');
            // console.log('token', token);
            // console.log('user', user);

            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            session.user.id = token.id;
            session.user.email = token.email;
            session.user.csrf_token = token.csrf_token;
            session.user.access_token = token.access_token;
            session.user.access_token_expiry = token.access_token_expiry;
            session.user.name = token.name;

            // console.log('===============Callback session|auth.ts==================');
            // console.log('session', session);
            // console.log('token', token);
            // console.log('===============End|auth.ts==================');

            return session;
        },
    },
    session: {
        strategy: 'jwt',
        maxAge: 5 * 24 * 60 * 60,
    },
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: '/login',
        signOut: '/auth/signout',
    },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
