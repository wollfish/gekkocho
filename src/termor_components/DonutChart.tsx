// Tremor DonutChart [v0.0.1]
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React from 'react';
import { Pie, PieChart as ReChartsDonutChart, ResponsiveContainer, Sector, Tooltip } from 'recharts';

import {
    AvailableChartColors,
    AvailableChartColorsKeys,
    constructCategoryColors,
    getColorClassName,
} from '@/termor_lib/chartUtils';
import { cx } from '@/termor_lib/utils';

const sumNumericArray = (arr: number[]): number =>
    arr.reduce((sum, num) => sum + num, 0);

const parseData = (
    data: Record<string, any>[],
    categoryColors: Map<string, AvailableChartColorsKeys>,
    category: string
) =>
    data.map((dataPoint) => ({
        ...dataPoint,
        color: categoryColors.get(dataPoint[category]) || AvailableChartColors[0],
        className: getColorClassName(
            categoryColors.get(dataPoint[category]) || AvailableChartColors[0],
            'fill'
        ),
    }));

const calculateDefaultLabel = (data: any[], valueKey: string): number =>
    sumNumericArray(data.map((dataPoint) => dataPoint[valueKey]));

const parseLabelInput = (
    labelInput: string | undefined,
    valueFormatter: (value: number) => string,
    data: any[],
    valueKey: string
): string => labelInput || valueFormatter(calculateDefaultLabel(data, valueKey));

//#region Tooltip

type TooltipProps = Pick<ChartTooltipProps, 'active' | 'payload'>;

type PayloadItem = {
    category: string
    value: number
    color: AvailableChartColorsKeys
};

interface ChartTooltipProps {
    active: boolean | undefined
    payload: PayloadItem[]
    valueFormatter: (value: number) => string
}

const ChartTooltip = (props: ChartTooltipProps) => {
    const { active, payload, valueFormatter } = props;

    if (active && payload && payload.length) {
        return (
            <div
                className={cx(
                    // base
                    'rounded-md border text-sm shadow-md',
                    // border color
                    'border-gray-200 dark:border-gray-800',
                    // background color
                    'bg-white dark:bg-gray-950'
                )}
            >
                <div className={cx('space-y-1 px-4 py-2')}>
                    {payload.map(({ value, category, color }, index) => (
                        <div
                            key={`id-${index}`}
                            className="flex items-center justify-between space-x-8"
                        >
                            <div className="flex items-center space-x-2">
                                <span
                                    aria-hidden="true"
                                    className={cx(
                                        'size-2 shrink-0 rounded-full',
                                        getColorClassName(color, 'bg')
                                    )}
                                />
                                <p
                                    className={cx(
                                        // base
                                        'whitespace-nowrap text-right',
                                        // text color
                                        'text-gray-700 dark:text-gray-300'
                                    )}
                                >
                                    {category}
                                </p>
                            </div>
                            <p
                                className={cx(
                                    // base
                                    'whitespace-nowrap text-right font-medium tabular-nums',
                                    // text color
                                    'text-gray-900 dark:text-gray-50'
                                )}
                            >
                                {valueFormatter(value)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};

const renderInactiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, className } =
        props;

    return (
        <Sector
            className={className}
            cx={cx}
            cy={cy}
            endAngle={endAngle}
            fill=""
            innerRadius={innerRadius}
            opacity={0.3}
            outerRadius={outerRadius}
            startAngle={startAngle}
            style={{ outline: 'none' }}
        />
    );
};

type DonutChartVariant = 'donut' | 'pie';

type BaseEventProps = {
    eventType: 'sector'
    categoryClicked: string
    [key: string]: number | string
};

type DonutChartEventProps = BaseEventProps | null | undefined;

interface DonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
    data: Record<string, any>[]
    category: string
    value: string
    colors?: AvailableChartColorsKeys[]
    variant?: DonutChartVariant
    valueFormatter?: (value: number) => string
    label?: string
    showLabel?: boolean
    showTooltip?: boolean
    onValueChange?: (value: DonutChartEventProps) => void
    tooltipCallback?: (tooltipCallbackContent: TooltipProps) => void
    customTooltip?: React.ComponentType<TooltipProps>
}

const DonutChart = React.forwardRef<HTMLDivElement, DonutChartProps>(
    (
        {
            data = [],
            value,
            category,
            colors = AvailableChartColors,
            variant = 'donut',
            valueFormatter = (value: number) => value.toString(),
            label,
            showLabel = false,
            showTooltip = true,
            onValueChange,
            tooltipCallback,
            customTooltip,
            className,
            ...other
        },
        forwardedRef
    ) => {
        const CustomTooltip = customTooltip;
        const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
            undefined
        );
        const isDonut = variant === 'donut';
        const parsedLabelInput = parseLabelInput(label, valueFormatter, data, value);

        const categories = Array.from(new Set(data.map((item) => item[category])));
        const categoryColors = constructCategoryColors(categories, colors);

        const prevActiveRef = React.useRef<boolean | undefined>(undefined);
        const prevCategoryRef = React.useRef<string | undefined>(undefined);

        const handleShapeClick = (
            data: any,
            index: number,
            event: React.MouseEvent
        ) => {
            event.stopPropagation();
            if (!onValueChange) return;

            if (activeIndex === index) {
                setActiveIndex(undefined);
                onValueChange(null);
            } else {
                setActiveIndex(index);
                onValueChange({
                    eventType: 'sector',
                    categoryClicked: data.payload[category],
                    ...data.payload,
                });
            }
        };

        return (
            <div
                ref={forwardedRef}
                className={cx('h-40 w-40', className)}
                tremor-id="tremor-raw"
                {...other}
            >
                <ResponsiveContainer className="size-full">
                    <ReChartsDonutChart
                        margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
                        onClick={
                            onValueChange && activeIndex !== undefined
                                ? () => {
                                    setActiveIndex(undefined);
                                    onValueChange(null);
                                }
                                : undefined
                        }
                    >
                        {showLabel && isDonut && (
                            <text
                                className="fill-gray-700 text-tiny dark:fill-gray-300"
                                dominantBaseline="middle"
                                textAnchor="middle"
                                x="50%"
                                y="50%"
                            >
                                {parsedLabelInput}
                            </text>
                        )}
                        <Pie
                            activeIndex={activeIndex}
                            className={cx(
                                'stroke-white dark:stroke-gray-950 [&_.recharts-pie-sector]:outline-none',
                                onValueChange ? 'cursor-pointer' : 'cursor-default'
                            )}
                            cx="50%"
                            cy="50%"
                            data={parseData(data, categoryColors, category)}
                            dataKey={value}
                            endAngle={-270}
                            inactiveShape={renderInactiveShape}
                            innerRadius={isDonut ? '75%' : '0%'}
                            isAnimationActive={false}
                            nameKey={category}
                            outerRadius="100%"
                            startAngle={90}
                            stroke=""
                            strokeLinejoin="round"
                            style={{ outline: 'none' }}
                            onClick={handleShapeClick}
                        />
                        {showTooltip && (
                            <Tooltip
                                content={({ active, payload }) => {
                                    const cleanPayload = payload
                                        ? payload.map((item: any) => ({
                                            category: item.payload[category],
                                            value: item.value,
                                            color: categoryColors.get(
                                                item.payload[category]
                                            ) as AvailableChartColorsKeys,
                                        }))
                                        : [];

                                    const payloadCategory: string = cleanPayload[0]?.category;

                                    if (
                                        tooltipCallback &&
                                        (active !== prevActiveRef.current ||
                                            payloadCategory !== prevCategoryRef.current)
                                    ) {
                                        tooltipCallback({
                                            active,
                                            payload: cleanPayload,
                                        });
                                        prevActiveRef.current = active;
                                        prevCategoryRef.current = payloadCategory;
                                    }

                                    return showTooltip && active ? (
                                        CustomTooltip ? (
                                            <CustomTooltip active={active} payload={cleanPayload}/>
                                        ) : (
                                            <ChartTooltip
                                                active={active}
                                                payload={cleanPayload}
                                                valueFormatter={valueFormatter}
                                            />
                                        )
                                    ) : null;
                                }}
                                isAnimationActive={false}
                                wrapperStyle={{ outline: 'none' }}
                            />
                        )}
                    </ReChartsDonutChart>
                </ResponsiveContainer>
            </div>
        );
    }
);

DonutChart.displayName = 'DonutChart';

export { DonutChart, type DonutChartEventProps, type TooltipProps };
