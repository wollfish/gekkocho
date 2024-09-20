import React from 'react';

import { Button } from '@nextui-org/button';

import { Icons, Logo } from '@/components/icons';

export const PayCTA: React.FC = () => {
    return (
        <div className="w-[320px] rounded-lg border border-dashed bg-default/5 p-4 shadow-lg backdrop-blur-sm contain-content dark:border-default">
            <div className="mb-4 flex items-center justify-between px-2 text-sm">
                <div className="font-semibold">50,000.00 USD</div>
                <div className="-ml-1 flex items-center gap-1">
                    <p>Order Id: <span className="font-semibold">#8945</span></p>
                </div>
            </div>
            <Button fullWidth className="justify-between" variant="flat">
                <span className="flex items-center gap-2"><Icons.circle/>Pay Using</span>
                <div className="flex items-center">
                    <Logo size={32}/>
                    <p className="font-bold">CoinDhan Pay</p>
                </div>
            </Button>
        </div>
    );
};