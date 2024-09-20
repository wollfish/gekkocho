import { Suspense } from 'react';
import NextLink from 'next/link';

import { SignUpForm } from '@/components/AuthPages/SignUpForm';
import { Logo } from '@/components/icons';
import { description, link, subtitle } from '@/components/primitives';

export default function SignupPage() {
    return (
        <section className="m-6 rounded-lg border border-default shadow-lg md:w-[460px]">
            <div className="border-b border-dashed border-default p-6">
                <NextLink className="-ml-1 mb-4 flex items-center gap-1" href="/">
                    <Logo size={32}/>
                    <span className="font-bold">CoinDhan Pay</span>
                </NextLink>
                <h2 className={subtitle()}>
                    Sign Up to your account
                </h2>
                <p className={description({ size: 'xs', className: 'm-0' })}>
                    Already have an account? <NextLink href="/login">Sign in</NextLink>
                </p>
            </div>
            <div className="p-6">
                <Suspense>
                    <SignUpForm/>
                </Suspense>
            </div>
            <div className="pb-6">
                <p className="flex justify-center gap-1 text-center text-sm">
                    <span>Don&apos;t have an account?</span>
                    <NextLink className={link().base()} href="/login">Sign In</NextLink>
                </p>
            </div>
        </section>
    );
}
