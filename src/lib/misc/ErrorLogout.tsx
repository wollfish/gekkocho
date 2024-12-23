'use client';

import React, { useEffect } from 'react';

import { doLogout } from '@/actions/auth';

interface Props {
    error: string;
}

export const ErrorLogout: React.FC<Props> = ({ error }) => {
    useEffect(() => {
        if (['authz.invalid_session'].includes(error)) {
            const handleLogout = async () => {
                await doLogout('/login');
            };

            handleLogout();
        }
    }, [error]);

    return null;
};
