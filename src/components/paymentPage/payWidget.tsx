import 'server-only';

import React from 'react';
import { Divider } from '@nextui-org/divider';

import { Snippet } from '@nextui-org/snippet';

import { Icons, Logo } from '@/components/icons';
import { QRCodeGenerator } from '@/components/qrCodeGenerator';

export const PayWidget: React.FC<{ qrCode?: string }> = ({ qrCode = '0x5753db8ea94bfd98377fee96e0ef8cf2544ca421' }) => {
    return (
        <section
            className="w-full rounded-lg border border-dashed bg-white shadow-lg contain-content dark:border-default dark:bg-default-50 md:w-[380px]">
            <div className="bg-default-100 p-4">
                <div className="flex items-center justify-between">
                    <div className="-ml-1 flex items-center gap-1">
                        <Logo size={32}/>
                        <p className="font-bold">CoinDhan Pay</p>
                    </div>
                    <div>Order Id: <span className="text-sm font-semibold">#8945</span></div>
                </div>
                <div className="font-semibold">Fiat: 5,000.00 USD</div>
            </div>
            <div className="p-4">
                <div
                    className="mx-auto mb-2 flex w-fit items-center justify-center gap-2 rounded border border-dashed px-2 py-1 text-sm dark:border-default"
                >
                    <span>Network :</span>
                    <span className="flex items-center justify-center font-semibold">
                        <Icons.eth/>
                        <span className="ml-1 mr-2">ETH Mainnet </span>
                        <Icons.info className="text-primary"/>
                    </span>
                </div>
                <QRCodeGenerator value={qrCode}/>
                <div className="mb-4">
                    <div className="mb-1 text-sm font-semibold">Amount:</div>
                    <Snippet
                        hideSymbol
                        className="w-full"
                        classNames={{ pre: 'break-all whitespace-normal' }}
                        radius="sm"
                    >
                        1.98 ETH
                    </Snippet>
                </div>
                <div className="mb-4">
                    <div className="mb-1 text-sm font-semibold">Address:</div>
                    <Snippet
                        hideSymbol
                        className="w-full"
                        classNames={{ pre: 'break-all whitespace-normal' }}
                        radius="sm"
                    >
                        {qrCode}
                    </Snippet>
                </div>
                <Divider/>
                <div className="flex items-center justify-center gap-1 pt-4 text-sm">
                    <span>Time Remaining:</span><span className="text-success">00:20:36s</span>
                </div>
            </div>
        </section>
    );
};
