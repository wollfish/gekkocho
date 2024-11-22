// Tremor Raw LineChart [v0.0.0]

'use client';

import React from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import {
    CartesianGrid,
    Dot,
    Label,
    Legend as RechartsLegend,
    Line,
    LineChart as RechartsLineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { AxisDomain } from 'recharts/types/util/types';

import {
    AvailableChartColors,
    AvailableChartColorsKeys,
    constructCategoryColors,
    getColorClassName,
    getYAxisDomain,
    hasOnlyOneValueForKey,
} from '@/termor_lib/chartUtils';

import { useOnWindowResize } from '@/termor_lib/useOnWindowResize';
import { cx, percentageFormatter } from '@/termor_lib/utils';

import { Badge } from './Badge';
import { getBadgeType } from './ui/overview/DashboardChartCard';

//#region Legend

interface LegendItemProps {
    name: string
    color: AvailableChartColorsKeys
    onClick?: (name: string, color: AvailableChartColorsKeys) => void
    activeLegend?: string
}

const LegendItem = ({
    name,
    color,
    onClick,
    activeLegend,
}: LegendItemProps) => {
    const hasOnValueChange = !!onClick;

    return (
        <li
            className={cx(
                // base
                'group inline-flex flex-nowrap items-center gap-1.5 whitespace-nowrap rounded px-2 py-1 transition',
                hasOnValueChange
                    ? 'bg-transpaent cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'cursor-default'
            )}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.(name, color);
            }}
        >
            <span
                aria-hidden="true"
                className={cx(
                    'h-[3px] w-3.5 shrink-0 rounded-full',
                    getColorClassName(color, 'bg'),
                    activeLegend && activeLegend !== name ? 'opacity-40' : 'opacity-100'
                )}
            />
            <p
                className={cx(
                    // base
                    'truncate whitespace-nowrap text-xs',
                    // text color
                    'text-gray-700 dark:text-gray-300',
                    hasOnValueChange &&
                    'group-hover:text-gray-900 dark:group-hover:text-gray-50',
                    activeLegend && activeLegend !== name ? 'opacity-40' : 'opacity-100'
                )}
            >
                {name}
            </p>
        </li>
    );
};

interface ScrollButtonProps {
    icon: React.ElementType
    onClick?: () => void
    disabled?: boolean
}

const ScrollButton = ({ icon, onClick, disabled }: ScrollButtonProps) => {
    const Icon = icon;
    const [isPressed, setIsPressed] = React.useState(false);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        if (isPressed) {
            intervalRef.current = setInterval(() => {
                onClick?.();
            }, 300);
        } else {
            clearInterval(intervalRef.current as NodeJS.Timeout);
        }

        return () => clearInterval(intervalRef.current as NodeJS.Timeout);
    }, [isPressed, onClick]);

    React.useEffect(() => {
        if (disabled) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            setIsPressed(false);
        }
    }, [disabled]);

    return (
        <button
            className={cx(
                // base
                'group inline-flex size-5 items-center truncate rounded transition',
                disabled
                    ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                    : 'cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50'
            )}
            disabled={disabled}
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
                setIsPressed(true);
            }}
            onMouseUp={(e) => {
                e.stopPropagation();
                setIsPressed(false);
            }}
        >
            <Icon aria-hidden="true" className="size-full"/>
        </button>
    );
};

interface LegendProps extends React.OlHTMLAttributes<HTMLOListElement> {
    categories: string[]
    colors?: AvailableChartColorsKeys[]
    onClickLegendItem?: (category: string, color: string) => void
    activeLegend?: string
    enableLegendSlider?: boolean
}

type HasScrollProps = {
    left: boolean
    right: boolean
};

const Legend = React.forwardRef<HTMLOListElement, LegendProps>((props, ref) => {
    const {
        categories,
        colors = AvailableChartColors,
        className,
        onClickLegendItem,
        activeLegend,
        enableLegendSlider = false,
        ...other
    } = props;
    const scrollableRef = React.useRef<HTMLInputElement>(null);
    const [hasScroll, setHasScroll] = React.useState<HasScrollProps | null>(null);
    const [isKeyDowned, setIsKeyDowned] = React.useState<string | null>(null);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    const checkScroll = React.useCallback(() => {
        const scrollable = scrollableRef?.current;

        if (!scrollable) return;

        const hasLeftScroll = scrollable.scrollLeft > 0;
        const hasRightScroll =
            scrollable.scrollWidth - scrollable.clientWidth > scrollable.scrollLeft;

        setHasScroll({ left: hasLeftScroll, right: hasRightScroll });
    }, [setHasScroll]);

    const scrollToTest = React.useCallback(
        (direction: 'left' | 'right') => {
            const element = scrollableRef?.current;
            const width = element?.clientWidth ?? 0;

            if (element && enableLegendSlider) {
                element.scrollTo({
                    left:
                        direction === 'left'
                            ? element.scrollLeft - width
                            : element.scrollLeft + width,
                    behavior: 'smooth',
                });
                setTimeout(() => {
                    checkScroll();
                }, 400);
            }
        },
        [enableLegendSlider, checkScroll]
    );

    React.useEffect(() => {
        const keyDownHandler = (key: string) => {
            if (key === 'ArrowLeft') {
                scrollToTest('left');
            } else if (key === 'ArrowRight') {
                scrollToTest('right');
            }
        };

        if (isKeyDowned) {
            keyDownHandler(isKeyDowned);
            intervalRef.current = setInterval(() => {
                keyDownHandler(isKeyDowned);
            }, 300);
        } else {
            clearInterval(intervalRef.current as NodeJS.Timeout);
        }

        return () => clearInterval(intervalRef.current as NodeJS.Timeout);
    }, [isKeyDowned, scrollToTest]);

    const keyDown = (e: KeyboardEvent) => {
        e.stopPropagation();
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            setIsKeyDowned(e.key);
        }
    };
    const keyUp = (e: KeyboardEvent) => {
        e.stopPropagation();
        setIsKeyDowned(null);
    };

    React.useEffect(() => {
        const scrollable = scrollableRef?.current;

        if (enableLegendSlider) {
            checkScroll();
            scrollable?.addEventListener('keydown', keyDown);
            scrollable?.addEventListener('keyup', keyUp);
        }

        return () => {
            scrollable?.removeEventListener('keydown', keyDown);
            scrollable?.removeEventListener('keyup', keyUp);
        };
    }, [checkScroll, enableLegendSlider]);

    return (
        <ol
            ref={ref}
            className={cx('relative overflow-hidden', className)}
            {...other}
        >
            <div
                ref={scrollableRef}
                className={cx(
                    'flex h-full',
                    enableLegendSlider
                        ? hasScroll?.right || hasScroll?.left
                            ? 'snap-mandatory items-center overflow-auto pl-4 pr-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
                            : ''
                        : 'flex-wrap'
                )}
            >
                {categories.map((category, index) => (
                    <LegendItem
                        key={`item-${index}`}
                        activeLegend={activeLegend}
                        color={colors[index] as AvailableChartColorsKeys}
                        name={category}
                        onClick={onClickLegendItem}
                    />
                ))}
            </div>
            {enableLegendSlider && (hasScroll?.right || hasScroll?.left) ? (
                <>
                    <div
                        className={cx(
                            // base
                            'absolute bottom-0 right-0 top-0 flex h-full items-center justify-center pr-1',
                            // background color
                            'bg-white dark:bg-gray-950'
                        )}
                    >
                        <ScrollButton
                            disabled={!hasScroll?.left}
                            icon={RiArrowLeftSLine}
                            onClick={() => {
                                setIsKeyDowned(null);
                                scrollToTest('left');
                            }}
                        />
                        <ScrollButton
                            disabled={!hasScroll?.right}
                            icon={RiArrowRightSLine}
                            onClick={() => {
                                setIsKeyDowned(null);
                                scrollToTest('right');
                            }}
                        />
                    </div>
                </>
            ) : null}
        </ol>
    );
});

Legend.displayName = 'Legend';

const ChartLegend = (
    { payload }: any,
    categoryColors: Map<string, AvailableChartColorsKeys>,
    setLegendHeight: React.Dispatch<React.SetStateAction<number>>,
    activeLegend: string | undefined,
    onClick?: (category: string, color: string) => void,
    enableLegendSlider?: boolean
) => {
    const legendRef = React.useRef<HTMLDivElement>(null);

    useOnWindowResize(() => {
        const calculateHeight = (height: number | undefined) =>
            height ? Number(height) + 15 : 60;

        setLegendHeight(calculateHeight(legendRef.current?.clientHeight));
    });

    const filteredPayload = payload.filter((item: any) => item.type !== 'none');

    return (
        <div ref={legendRef} className="flex items-center justify-end">
            <Legend
                activeLegend={activeLegend}
                categories={filteredPayload.map((entry: any) => entry.value)}
                colors={filteredPayload.map((entry: any) =>
                    categoryColors.get(entry.value)
                )}
                enableLegendSlider={enableLegendSlider}
                onClickLegendItem={onClick}
            />
        </div>
    );
};

//#region Tooltip

interface ChartTooltipRowProps {
    value: string
    name: string
    color: string
}

const ChartTooltipRow = ({ value, name, color }: ChartTooltipRowProps) => (
    <div className="flex items-center justify-between space-x-8">
        <div className="flex items-center space-x-2">
            <span
                aria-hidden="true"
                className={cx('h-[3px] w-3.5 shrink-0 rounded-full', color)}
            />
            <p
                className={cx(
                    // commmon
                    'whitespace-nowrap text-right',
                    // text color
                    'text-gray-700 dark:text-gray-300'
                )}
            >
                {name}
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
            {value}
        </p>
    </div>
);

interface ChartTooltipProps {
    active: boolean | undefined
    payload: any
    label: string
    categoryColors: Map<string, string>
    valueFormatter: (value: number) => string
}

const OverviewChartTooltip = ({
    active,
    payload,
    categoryColors,
    valueFormatter,
}: ChartTooltipProps) => {
    if (active && payload) {
        const filteredPayload = payload.filter((item: any) => item.type !== 'none');

        if (!active || !payload) return null;

        const title = payload[0].payload.title;
        const evolution = payload[0].payload.evolution;

        if (!title) return null;

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
                <div className="flex items-start justify-between gap-2 border-b border-inherit p-2">
                    <p
                        className={cx(
                            // base
                            'font-medium',
                            // text color
                            'text-gray-900 dark:text-gray-50'
                        )}
                    >
                        {title}
                    </p>
                    {evolution !== undefined && (
                        <Badge variant={getBadgeType(evolution)}>
                            {percentageFormatter(evolution)}
                        </Badge>
                    )}
                </div>
                <div className={cx('space-y-1 p-2')}>
                    {filteredPayload.map((payload: any, index: number) => {
                        const payloadData = payload.payload;

                        return (
                            <ChartTooltipRow
                                key={`id-${index}`}
                                color={getColorClassName(
                                    categoryColors.get(payload.name) as AvailableChartColorsKeys,
                                    'bg'
                                )}
                                name={
                                    index === 0
                                        ? payloadData.formattedDate
                                        : payloadData.previousFormattedDate
                                }
                                value={valueFormatter(payload.value)}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }

    return null;
};

//#region LineChart

interface ActiveDot {
    index?: number
    dataKey?: string
}

type BaseEventProps = {
    eventType: 'dot' | 'category'
    categoryClicked: string
    [key: string]: number | string
};

type LineChartEventProps = BaseEventProps | null | undefined;

interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
    data: Record<string, any>[]
    index: string
    categories: string[]
    colors?: AvailableChartColorsKeys[]
    valueFormatter?: (value: number) => string
    startEndOnly?: boolean
    showXAxis?: boolean
    showYAxis?: boolean
    showGridLines?: boolean
    yAxisWidth?: number
    intervalType?: 'preserveStartEnd' | 'equidistantPreserveStart'
    showTooltip?: boolean
    showLegend?: boolean
    autoMinValue?: boolean
    minValue?: number
    maxValue?: number
    allowDecimals?: boolean
    onValueChange?: (value: LineChartEventProps) => void
    enableLegendSlider?: boolean
    tickGap?: number
    connectNulls?: boolean
    xAxisLabel?: string
    yAxisLabel?: string
}

const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
    (props, ref) => {
        const {
            data = [],
            categories = [],
            index,
            colors = AvailableChartColors,
            valueFormatter = (value: number) => value.toString(),
            startEndOnly = false,
            showXAxis = true,
            showYAxis = true,
            showGridLines = true,
            yAxisWidth = 56,
            intervalType = 'equidistantPreserveStart',
            showTooltip = true,
            showLegend = true,
            autoMinValue = false,
            minValue,
            maxValue,
            allowDecimals = true,
            connectNulls = false,
            className,
            onValueChange,
            enableLegendSlider = false,
            tickGap = 5,
            xAxisLabel,
            yAxisLabel,
            ...other
        } = props;
        const paddingValue = !showXAxis && !showYAxis ? 0 : 20;
        const [legendHeight, setLegendHeight] = React.useState(60);
        const [activeDot, setActiveDot] = React.useState<ActiveDot | undefined>(
            undefined
        );
        const [activeLegend, setActiveLegend] = React.useState<string | undefined>(
            undefined
        );
        const categoryColors = constructCategoryColors(categories, colors);

        const yAxisDomain = getYAxisDomain(autoMinValue, minValue, maxValue);
        const hasOnValueChange = !!onValueChange;

        function onDotClick(itemData: any, event: React.MouseEvent) {
            event.stopPropagation();

            if (!hasOnValueChange) return;
            if (
                (itemData.index === activeDot?.index &&
                    itemData.dataKey === activeDot?.dataKey) ||
                (hasOnlyOneValueForKey(data, itemData.dataKey) &&
                    activeLegend &&
                    activeLegend === itemData.dataKey)
            ) {
                setActiveLegend(undefined);
                setActiveDot(undefined);
                onValueChange?.(null);
            } else {
                setActiveLegend(itemData.dataKey);
                setActiveDot({
                    index: itemData.index,
                    dataKey: itemData.dataKey,
                });
                onValueChange?.({
                    eventType: 'dot',
                    categoryClicked: itemData.dataKey,
                    ...itemData.payload,
                });
            }
        }

        function onCategoryClick(dataKey: string) {
            if (!hasOnValueChange) return;
            if (
                (dataKey === activeLegend && !activeDot) ||
                (hasOnlyOneValueForKey(data, dataKey) &&
                    activeDot &&
                    activeDot.dataKey === dataKey)
            ) {
                setActiveLegend(undefined);
                onValueChange?.(null);
            } else {
                setActiveLegend(dataKey);
                onValueChange?.({
                    eventType: 'category',
                    categoryClicked: dataKey,
                });
            }
            setActiveDot(undefined);
        }

        return (
            <div ref={ref} className={cx('h-80 w-full', className)} {...other}>
                <ResponsiveContainer>
                    <RechartsLineChart
                        data={data}
                        margin={{
                            bottom: xAxisLabel ? 30 : undefined,
                            left: yAxisLabel ? 20 : undefined,
                            right: yAxisLabel ? 5 : undefined,
                            top: 0,
                        }}
                        onClick={
                            hasOnValueChange && (activeLegend || activeDot)
                                ? () => {
                                    setActiveDot(undefined);
                                    setActiveLegend(undefined);
                                    onValueChange?.(null);
                                }
                                : undefined
                        }
                    >
                        {showGridLines ? (
                            <CartesianGrid
                                className={cx('stroke-gray-200 stroke-1 dark:stroke-gray-800')}
                                horizontal={true}
                                vertical={false}
                            />
                        ) : null}
                        <XAxis
                            axisLine={false}
                            className={cx(
                                // base
                                'text-xs',
                                // text fill
                                'fill-gray-500 dark:fill-gray-500'
                            )}
                            dataKey={index}
                            fill=""
                            hide={!showXAxis}
                            interval={startEndOnly ? 'preserveStartEnd' : intervalType}
                            minTickGap={tickGap}
                            padding={{ left: paddingValue, right: paddingValue }}
                            stroke=""
                            tick={{ transform: 'translate(0, 6)' }}
                            tickLine={false}
                            ticks={
                                startEndOnly
                                    ? [data[0][index], data[data.length - 1][index]]
                                    : undefined
                            }
                        >
                            {xAxisLabel && (
                                <Label
                                    className="fill-gray-800 text-sm font-medium dark:fill-gray-200"
                                    offset={-20}
                                    position="insideBottom"
                                >
                                    {xAxisLabel}
                                </Label>
                            )}
                        </XAxis>
                        <YAxis
                            allowDecimals={allowDecimals}
                            axisLine={false}
                            className={cx(
                                // base
                                'text-xs',
                                // text fill
                                'fill-gray-500 dark:fill-gray-500'
                            )}
                            domain={yAxisDomain as AxisDomain}
                            fill=""
                            hide={!showYAxis}
                            stroke=""
                            tick={{ transform: 'translate(-3, 0)' }}
                            tickFormatter={valueFormatter}
                            tickLine={false}
                            type="number"
                            width={yAxisWidth}
                        >
                            {yAxisLabel && (
                                <Label
                                    angle={-90}
                                    className="fill-gray-800 text-sm font-medium dark:fill-gray-200"
                                    offset={-15}
                                    position="insideLeft"
                                    style={{ textAnchor: 'middle' }}
                                >
                                    {yAxisLabel}
                                </Label>
                            )}
                        </YAxis>
                        <Tooltip
                            animationDuration={100}
                            content={
                                showTooltip ? (
                                    ({ active, payload, label }) => (
                                        <OverviewChartTooltip
                                            active={active}
                                            categoryColors={categoryColors}
                                            label={label}
                                            payload={payload}
                                            valueFormatter={valueFormatter}
                                        />
                                    )
                                ) : (
                                    <></>
                                )
                            }
                            cursor={{ stroke: '#d1d5db', strokeWidth: 1 }}
                            isAnimationActive={true}
                            offset={20}
                            position={{ y: 0 }}
                            wrapperStyle={{ outline: 'none' }}
                        />
                        {showLegend ? (
                            <RechartsLegend
                                content={({ payload }) =>
                                    ChartLegend(
                                        { payload },
                                        categoryColors,
                                        setLegendHeight,
                                        activeLegend,
                                        hasOnValueChange
                                            ? (clickedLegendItem: string) =>
                                                onCategoryClick(clickedLegendItem)
                                            : undefined,
                                        enableLegendSlider
                                    )
                                }
                                height={legendHeight}
                                verticalAlign="top"
                            />
                        ) : null}
                        {categories.map((category) => (
                            <Line
                                key={category}
                                activeDot={(props: any) => {
                                    const {
                                        cx: cxCoord,
                                        cy: cyCoord,
                                        stroke,
                                        strokeLinecap,
                                        strokeLinejoin,
                                        strokeWidth,
                                        dataKey,
                                    } = props;

                                    return (
                                        <Dot
                                            className={cx(
                                                'stroke-white dark:stroke-gray-950',
                                                onValueChange ? 'cursor-pointer' : '',
                                                getColorClassName(
                                                    categoryColors.get(
                                                        dataKey
                                                    ) as AvailableChartColorsKeys,
                                                    'fill'
                                                )
                                            )}
                                            cx={cxCoord}
                                            cy={cyCoord}
                                            fill=""
                                            r={5}
                                            stroke={stroke}
                                            strokeLinecap={strokeLinecap}
                                            strokeLinejoin={strokeLinejoin}
                                            strokeWidth={strokeWidth}
                                            onClick={(_, event) => onDotClick(props, event)}
                                        />
                                    );
                                }}
                                className={cx(
                                    getColorClassName(
                                        categoryColors.get(category) as AvailableChartColorsKeys,
                                        'stroke'
                                    )
                                )}
                                connectNulls={connectNulls}
                                dataKey={category}
                                dot={(props: any) => {
                                    const {
                                        stroke,
                                        strokeLinecap,
                                        strokeLinejoin,
                                        strokeWidth,
                                        cx: cxCoord,
                                        cy: cyCoord,
                                        dataKey,
                                        index,
                                    } = props;

                                    if (
                                        (hasOnlyOneValueForKey(data, category) &&
                                            !(
                                                activeDot ||
                                                (activeLegend && activeLegend !== category)
                                            )) ||
                                        (activeDot?.index === index &&
                                            activeDot?.dataKey === category)
                                    ) {
                                        return (
                                            <Dot
                                                key={index}
                                                className={cx(
                                                    'stroke-white dark:stroke-gray-950',
                                                    onValueChange ? 'cursor-pointer' : '',
                                                    getColorClassName(
                                                        categoryColors.get(
                                                            dataKey
                                                        ) as AvailableChartColorsKeys,
                                                        'fill'
                                                    )
                                                )}
                                                cx={cxCoord}
                                                cy={cyCoord}
                                                fill=""
                                                r={5}
                                                stroke={stroke}
                                                strokeLinecap={strokeLinecap}
                                                strokeLinejoin={strokeLinejoin}
                                                strokeWidth={strokeWidth}
                                            />
                                        );
                                    }

                                    return <React.Fragment key={index}/>;
                                }}
                                isAnimationActive={false}
                                name={category}
                                stroke=""
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeOpacity={
                                    activeDot || (activeLegend && activeLegend !== category)
                                        ? 0.3
                                        : 1
                                }
                                strokeWidth={2}
                                type="linear"
                            />
                        ))}
                        {/* hidden lines to increase clickable target area */}
                        {onValueChange
                            ? categories.map((category) => (
                                <Line
                                    key={category}
                                    className={cx('cursor-pointer')}
                                    connectNulls={connectNulls}
                                    dataKey={category}
                                    fill="transparent"
                                    legendType="none"
                                    name={category}
                                    stroke="transparent"
                                    strokeOpacity={0}
                                    strokeWidth={12}
                                    tooltipType="none"
                                    type="linear"
                                    onClick={(props: any, event) => {
                                        event.stopPropagation();
                                        const { name } = props;

                                        onCategoryClick(name);
                                    }}
                                />
                            ))
                            : null}
                    </RechartsLineChart>
                </ResponsiveContainer>
            </div>
        );
    }
);

LineChart.displayName = 'LineChart';

export { LineChart, type LineChartEventProps };
