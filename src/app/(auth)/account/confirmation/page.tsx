'use client';

import React, { useEffect } from 'react';
import { Progress } from '@nextui-org/progress';
import { useQuery } from '@tanstack/react-query';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';

import { toast } from 'sonner';

import { verifyEmailToken } from '@/actions/auth';
import { link } from '@/components/primitives';

export default function Page() {
    const searchParams = useSearchParams();

    const token = searchParams.get('confirmation_token');

    const { isSuccess } = useQuery({
        queryKey: ['email_verification', token],
        queryFn: () => verifyEmailToken({ token }),
        retry: false,
    });

    useEffect(() => {
        toast.success('Email verified successfully');
    }, [isSuccess]);

    return (
        <React.Fragment>
            {!isSuccess && <Progress
                isIndeterminate
                aria-label="Loading..."
                className="max-w-md"
                size="sm"
            />}
            {isSuccess &&
                <div className="flex flex-col items-center justify-center">
                    <p className="mt-4 text-center text-sm text-default-400">
                        Your email has been verified. You can now close this page.
                    </p>
                    <NextLink className={link().base({ type: 'underline' })} href="/login">
                        Go to login
                    </NextLink>
                </div>
            }
        </React.Fragment>
    );
}
