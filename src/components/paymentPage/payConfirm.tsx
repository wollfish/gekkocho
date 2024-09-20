import React from 'react';
import { Divider } from '@nextui-org/divider';

import { Icons } from '@/components/icons';

export const PayConfirm: React.FC = () => {
    return (
        <div className="w-[320px] rounded-lg border border-dashed bg-default/5 p-4 opacity-80 shadow-lg backdrop-blur-sm dark:border-default">
            <p className="flex items-center justify-center gap-2 text-sm">
                <Icons.flower className="text-success-500"/>
                <span>Payment is successful</span>
                <Icons.flower className="text-success-500"/>
            </p>
            <Divider className="my-2"/>
            <p className="text-center text-xs font-semibold">
                For Order ID: #8945 | Amount: 50,000.00 USD
            </p>
        </div>
    );
};