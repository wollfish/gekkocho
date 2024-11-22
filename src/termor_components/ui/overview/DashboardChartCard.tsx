import { eachDayOfInterval, formatDate, interval, isWithinInterval, subYears } from 'date-fns';

import { Badge } from '@/termor_components/Badge';
import { LineChart } from '@/termor_components/LineChart';
import { overviews } from '@/termor_data/overview-data';
import { OverviewData } from '@/termor_data/schema';
import { cx, formatters, percentageFormatter } from '@/termor_lib/utils';

type DateRange = {
    from?: Date;
    to?: Date;
};

export type PeriodValue = 'previous-period' | 'last-year' | 'no-comparison';

export const getPeriod = (dateRange: DateRange | undefined): DateRange | undefined => {
    if (!dateRange) return undefined;
    const from = dateRange.from;
    const to = dateRange.to;
    let lastYearFrom;
    let lastYearTo;

    if (from) {
        lastYearFrom = subYears(from, 1);
    }
    if (to) {
        lastYearTo = subYears(to, 1);
    }

    return { from: lastYearFrom, to: lastYearTo };
};

export type CardProps = {
    title: keyof OverviewData
    type: 'currency' | 'unit'
    selectedDates: DateRange | undefined
    selectedPeriod: PeriodValue
    isThumbnail?: boolean
};

const formattingMap = {
    currency: formatters.currency,
    unit: formatters.unit,
};

export const getBadgeType = (value: number) => {
    if (value > 0) {
        return 'success';
    } else if (value < 0) {
        if (value < -50) {
            return 'warning';
        }

        return 'error';
    } else {
        return 'neutral';
    }
};

export function ChartCard(props: CardProps) {

    const { title, type, selectedDates, selectedPeriod, isThumbnail } = props;

    const formatter = formattingMap[type];
    const selectedDatesInterval =
        selectedDates?.from && selectedDates?.to
            ? interval(selectedDates.from, selectedDates.to)
            : null;
    const allDatesInInterval =
        selectedDates?.from && selectedDates?.to
            ? eachDayOfInterval(interval(selectedDates.from, selectedDates.to))
            : null;
    const prevDates = getPeriod(selectedDates);

    const prevDatesInterval =
        prevDates?.from && prevDates?.to
            ? interval(prevDates.from, prevDates.to)
            : null;

    const data = overviews
        .filter((overview) => {
            if (selectedDatesInterval) {
                return isWithinInterval(overview.date, selectedDatesInterval);
            }

            return true;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const prevData = overviews
        .filter((overview) => {
            if (prevDatesInterval) {
                return isWithinInterval(overview.date, prevDatesInterval);
            }

            return false;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const chartData = allDatesInInterval
        ?.map((date, index) => {
            const overview = data[index];
            const prevOverview = prevData[index];
            const value = (overview?.[title] as number) || null;
            const previousValue = (prevOverview?.[title] as number) || null;

            return {
                title,
                date: date,
                formattedDate: formatDate(date, 'dd/MM/yyyy'),
                value,
                previousDate: prevOverview?.date,
                previousFormattedDate: prevOverview
                    ? formatDate(prevOverview.date, 'dd/MM/yyyy')
                    : null,
                previousValue:
                    selectedPeriod !== 'no-comparison' ? previousValue : null,
                evolution:
                    selectedPeriod !== 'no-comparison' && value && previousValue
                        ? (value - previousValue) / previousValue
                        : undefined,
            };
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const categories =
        selectedPeriod === 'no-comparison' ? ['value'] : ['value', 'previousValue'];
    const value =
        chartData?.reduce((acc, item) => acc + (item.value || 0), 0) || 0;
    const previousValue =
        chartData?.reduce((acc, item) => acc + (item.previousValue || 0), 0) || 0;
    const evolution =
        selectedPeriod !== 'no-comparison'
            ? (value - previousValue) / previousValue
            : 0;

    return (
        <div className={cx('transition')}>
            <div className="flex items-center justify-between gap-x-2">
                <div className="flex items-center gap-x-2">
                    <dt className="font-bold text-gray-900 dark:text-gray-50 sm:text-sm">
                        {title}
                    </dt>
                    {selectedPeriod !== 'no-comparison' && (
                        <Badge variant={getBadgeType(evolution)}>
                            {percentageFormatter(evolution)}
                        </Badge>
                    )}
                </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
                <dd className="text-xl text-gray-900 dark:text-gray-50">
                    {formatter(value)}
                </dd>
                {selectedPeriod !== 'no-comparison' && (
                    <dd className="text-sm text-gray-500">
                        from {formatter(previousValue)}
                    </dd>
                )}
            </div>
            <LineChart
                autoMinValue
                categories={categories}
                className="mt-6 h-32"
                colors={['indigo', 'gray']}
                data={chartData || []}
                index="formattedDate"
                showLegend={false}
                showTooltip={isThumbnail ? false : true}
                showYAxis={false}
                startEndOnly={true}
                valueFormatter={(value) => formatter(value as number)}
            />
        </div>
    );
}
