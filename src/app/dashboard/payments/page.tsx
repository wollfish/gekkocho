import React from 'react';

import { Chip } from '@nextui-org/chip';
import { Divider } from '@nextui-org/divider';

import { PaymentOverviewTimeSelector } from '@/app/dashboard/payments/utils';
import { PaymentOverviewCharts } from '@/app/dashboard/payments/utils/PaymentOverviewCharts';
import { subtitle } from '@/components/primitives';

export default function Page() {
    return (
        <section className="flex-1 overflow-auto py-4">
            <PaymentOverviewTimeSelector/>
            <div className="mb-10 flex flex-wrap justify-between gap-4">
                <div className="relative flex flex-col gap-3 pl-2">
                    <span className="absolute left-0 top-1 h-4 w-0.5 bg-default-500"/>
                    <h3 className={subtitle({ size: 'sm' })}>Total revenue</h3>
                    <div className={subtitle({ size: 'xl' })}>$2.6M</div>
                    <div className="flex items-center gap-1 text-sm text-default-400">
                        <Chip color="success" size="sm" variant="flat">+4.5%</Chip>
                        <span>from last week</span>
                    </div>
                </div>
                <div className="relative flex flex-col gap-3 pl-2">
                    <span className="absolute left-0 top-1 h-4 w-0.5 bg-default-500"/>
                    <h3 className={subtitle({ size: 'sm' })}>Average order value</h3>
                    <div className={subtitle({ size: 'xl' })}>$455</div>
                    <div className="flex items-center gap-1 text-sm text-default-400">
                        <Chip color="danger" size="sm" variant="flat">-0.5%</Chip>
                        <span>from last week</span>
                    </div>
                </div>
                <div className="relative flex flex-col gap-3 pl-2">
                    <span className="absolute left-0 top-1 h-4 w-0.5 bg-default-500"/>
                    <h3 className={subtitle({ size: 'sm' })}>Total new payment</h3>
                    <div className={subtitle({ size: 'xl' })}>1,234</div>
                    <div className="flex items-center gap-1 text-sm text-default-400">
                        <Chip color="success" size="sm" variant="flat">+10.5%</Chip>
                        <span>from last week</span>
                    </div>
                </div>
                <div className="relative flex flex-col gap-3 pl-2">
                    <span className="absolute left-0 top-1 h-4 w-0.5 bg-default-500"/>
                    <h3 className={subtitle({ size: 'sm' })}>Total failed payment</h3>
                    <div className={subtitle({ size: 'xl' })}>34</div>
                    <div className="flex items-center gap-1 text-sm text-default-400">
                        <Chip color="danger" size="sm" variant="flat">-8.5%</Chip>
                        <span>from last week</span>
                    </div>
                </div>
            </div>
            <Divider/>
            <PaymentOverviewCharts/>
        </section>
    );
}
