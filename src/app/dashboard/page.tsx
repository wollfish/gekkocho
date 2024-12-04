import React from 'react';
import { Divider } from '@nextui-org/divider';

import { getWithdrawalList } from '@/actions/dashboard/account';
import { fetchAnalytics } from '@/actions/dashboard/anylatics';
import { getPaymentList } from '@/actions/dashboard/payment';
import { PaymentOverviewTimeSelector } from '@/app/dashboard/payments/utils';
import { DashboardPaymentLinkList } from '@/app/dashboard/utils/DashboardPaymentLinkList';
import { DashboardPayoutsList } from '@/app/dashboard/utils/DashboardPayoutsList';
import { fetchData } from '@/lib/api';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';
import { subtitle } from 'src/components/primitives';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const { data: payments, error: paymentError } = await fetchData(getPaymentList);
    const { data: withdrawals, error: withdrawalError } = await fetchData(getWithdrawalList);
    const { data: analytics, error: analyticsError } = await fetchData(fetchAnalytics);

    console.log(analytics);

    return (
        <section className="flex size-full flex-col overflow-auto pr-16">
            <h3 className={subtitle({ size: 'lg', className: 'text-default-600' })}>
                Today’s Overview
            </h3>
            <div className="my-6 flex flex-wrap justify-between gap-4">
                <div className="relative flex flex-col gap-3 pl-2">
                    <span className="absolute left-0 top-1 h-4 w-0.5 bg-success"/>
                    <h3 className={subtitle({ size: 'sm' })}>Payment Received</h3>
                    <div className={subtitle({ size: 'xl' })}>590,788.00 AED</div>
                    <div className="flex items-center gap-1 text-sm text-default-500">
                        ~ 667,689.99 USDT
                    </div>
                </div>
                <div className="relative flex flex-col gap-3 pl-2">
                    <span className="absolute left-0 top-1 h-4 w-0.5 bg-green-600"/>
                    <h3 className={subtitle({ size: 'sm' })}>Payment Received <small>(yesterday)</small></h3>
                    <div className={subtitle({ size: 'xl' })}>546,788.00 AED</div>
                    <div className="flex items-center gap-1 text-sm text-default-500">
                        ~ 78,667.99 USDT
                    </div>
                </div>
                <div className="relative flex flex-col gap-3 pl-2">
                    <span className="absolute left-0 top-1 h-4 w-0.5 bg-danger"/>
                    <h3 className={subtitle({ size: 'sm' })}>Payouts</h3>
                    <div className={subtitle({ size: 'xl' })}>13,788.00 AED</div>
                    <div className="flex items-center gap-1 text-sm text-default-500">
                        ~ 24,667.99 USDT
                    </div>
                </div>
                <div className="relative flex flex-col gap-3 pl-2">
                    <span className="absolute left-0 top-1 h-4 w-0.5 bg-primary"/>
                    <h3 className={subtitle({ size: 'sm' })}>Total Balance </h3>
                    <div className={subtitle({ size: 'xl' })}>98,788.00 AED</div>
                    <div className="flex items-center gap-1 text-sm text-default-500">
                        ~ 7,667.99 USDT
                    </div>
                </div>
            </div>
            <Divider/>
            <section className="flex flex-col py-6">
                <PaymentOverviewTimeSelector/>
                <div className="grid grid-cols-6">
                    <div className="col-span-3 flex flex-col border-b border-r border-dashed border-divider pr-4">
                        <div className="relative pl-2">
                            <span className="absolute left-0 top-1 h-4 w-0.5 bg-success"/>
                            <h3 className={subtitle({ size: 'sm' })}>Payments</h3>
                        </div>
                        <div className="flex flex-1 overflow-auto">
                            <DataPageTemplate error={paymentError}>
                                <DashboardPaymentLinkList data={payments?.splice(0, 5) || []}/>
                            </DataPageTemplate>
                        </div>
                    </div>
                    <div className="col-span-3 border-b border-dashed border-divider pl-4">
                        <div className="relative pl-2">
                            <span className="absolute left-0 top-1 h-4 w-0.5 bg-danger"/>
                            <h3 className={subtitle({ size: 'sm' })}>Payouts</h3>
                        </div>
                        <div className="overflow-auto">
                            <DataPageTemplate error={withdrawalError}>
                                <DashboardPayoutsList data={withdrawals}/>
                            </DataPageTemplate>
                        </div>
                    </div>
                    <div className="col-span-2 border-r border-dashed border-divider py-4 pr-4">
                        <div className="relative mb-2 pl-2">
                            <span className="absolute left-0 top-1 h-4 w-0.5 bg-danger"/>
                            <h3 className={subtitle({ size: 'sm' })}>Payments</h3>
                        </div>
                        <div className="">
                            <div className="relative flex h-4 w-full items-center">
                                <div
                                    className="flex h-full flex-1 items-center gap-0.5 overflow-hidden rounded-full">
                                    <div className="h-full bg-primary" style={{ width: '65.3945%' }}/>
                                    <div className="h-full bg-warning" style={{ width: '15.0183%' }}/>
                                    <div className="h-full bg-secondary" style={{ width: '14.58716%' }}/>
                                    <div className="h-full bg-danger" style={{ width: '6.58716%' }}/>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <ul className="w-full">
                                    <li className="flex items-center border-b border-dashed border-divider py-2 text-sm">
                                        <span className="mr-2.5 block size-3 rounded bg-primary"/>
                                        <span className="text-default-500">Succeeded</span>
                                        <span className="ml-auto text-xs font-semibold">34,090 AED</span>
                                    </li>
                                    <li className="flex items-center border-b border-dashed border-divider py-2 text-sm">
                                        <span className="mr-2.5 block size-3 rounded bg-warning"/>
                                        <span className="text-default-500">Uncaptured</span>
                                        <span className="ml-auto text-xs font-semibold">68,790 AED</span>
                                    </li>
                                    <li className="flex items-center border-b border-dashed border-divider py-2 text-sm">
                                        <span className="mr-2.5 block size-3 rounded bg-secondary"/>
                                        <span className="text-default-500">Refunded</span>
                                        <span className="ml-auto text-xs font-semibold">58,674 AED</span>
                                    </li>
                                    <li className="flex items-center border-b border-dashed border-divider py-2 text-sm">
                                        <span className="mr-2.5 block size-3 rounded bg-danger"/>
                                        <span className="text-default-500">Failed</span>
                                        <span className="ml-auto text-xs font-semibold">80 AED</span>
                                    </li>
                                </ul>
                            </div>
                            <p className="mt-4 text-xs text-primary">View details</p>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}
