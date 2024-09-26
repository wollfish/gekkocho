'use client';
import React from 'react';
import { Button } from '@nextui-org/button';

import { useRouter } from 'next/navigation';

import { Icons } from '@/components/icons';

export const ReloadBtn: React.FC = () => {
    const router = useRouter();

    return (
        <Button isIconOnly={true} size="sm" onClick={router.refresh}>
            <Icons.refresh/>
        </Button>
    );
};
