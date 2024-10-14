'use client';

import React from 'react';
import { subDays, toDate } from 'date-fns';

import { cn } from '@/lib/utils';
import { ChartCard } from '@/termor_components/ui/overview/DashboardChartCard';
import { overviews } from '@/termor_data/overview-data';
import { OverviewData } from '@/termor_data/schema';

const overviewsDates = overviews.map((item) => toDate(item.date).getTime());
const maxDate = toDate(Math.max(...overviewsDates));

type  DateRange = {
    from?: Date;
    to?: Date;
};

const categories: {
    title: keyof OverviewData
    type: 'currency' | 'unit'
}[] = [
    {
        title: 'Rows read',
        type: 'unit',
    },
    {
        title: 'Rows written',
        type: 'unit',
    },
    {
        title: 'Queries',
        type: 'unit',
    },
    {
        title: 'Payments completed',
        type: 'currency',
    },
    {
        title: 'Sign ups',
        type: 'unit',
    },
    {
        title: 'Logins',
        type: 'unit',
    },
];

export const PaymentOverviewCharts = React.memo(() => {
    const [selectedDates, setSelectedDates] = React.useState<
        DateRange | undefined
    >({
        from: subDays(maxDate, 30),
        to: maxDate,
    });

    return (
        <div>
            <dl
                className={cn(
                    'mt-6 grid grid-cols-1 gap-14 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                )}
            >
                {categories.map((category) => {
                    return (
                        <ChartCard
                            key={category.title}
                            selectedDates={selectedDates}
                            selectedPeriod={'last-year'}
                            title={category.title}
                            type={category.type}
                        />
                    );
                })}
            </dl>
        </div>
    );
});
