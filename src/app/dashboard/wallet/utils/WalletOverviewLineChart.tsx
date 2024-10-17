'use client';

import React from 'react';

import { LineChart } from '@/termor_components/LineChart';

const data = [
    {
        date: 'Aug 01',
        'ETF Shares Vital': 2100.2,
        'Vitainvest Core': 4434.1,
        'iShares Tech Growth': 7943.2,
    },
    {
        date: 'Aug 02',
        'ETF Shares Vital': 2943.0,
        'Vitainvest Core': 4954.1,
        'iShares Tech Growth': 8954.1,
    },
    {
        date: 'Aug 03',
        'ETF Shares Vital': 4889.5,
        'Vitainvest Core': 6100.2,
        'iShares Tech Growth': 9123.7,
    },
    {
        date: 'Aug 04',
        'ETF Shares Vital': 3909.8,
        'Vitainvest Core': 4909.7,
        'iShares Tech Growth': 7478.4,
    },
    {
        date: 'Aug 05',
        'ETF Shares Vital': 5778.7,
        'Vitainvest Core': 7103.1,
        'iShares Tech Growth': 9504.3,
    },
    {
        date: 'Aug 06',
        'ETF Shares Vital': 5900.9,
        'Vitainvest Core': 7534.3,
        'iShares Tech Growth': 9943.4,
    },
    {
        date: 'Aug 07',
        'ETF Shares Vital': 4129.4,
        'Vitainvest Core': 7412.1,
        'iShares Tech Growth': 10112.2,
    },
    {
        date: 'Aug 08',
        'ETF Shares Vital': 6021.2,
        'Vitainvest Core': 7834.4,
        'iShares Tech Growth': 10290.2,
    },
    {
        date: 'Aug 09',
        'ETF Shares Vital': 6279.8,
        'Vitainvest Core': 8159.1,
        'iShares Tech Growth': 10349.6,
    },
    {
        date: 'Aug 10',
        'ETF Shares Vital': 6224.5,
        'Vitainvest Core': 8260.6,
        'iShares Tech Growth': 10415.4,
    },
    {
        date: 'Aug 11',
        'ETF Shares Vital': 6380.6,
        'Vitainvest Core': 8965.3,
        'iShares Tech Growth': 10636.3,
    },
    {
        date: 'Aug 12',
        'ETF Shares Vital': 6414.4,
        'Vitainvest Core': 7989.3,
        'iShares Tech Growth': 10900.5,
    },
    {
        date: 'Aug 13',
        'ETF Shares Vital': 6540.1,
        'Vitainvest Core': 7839.6,
        'iShares Tech Growth': 11040.4,
    },
    {
        date: 'Aug 14',
        'ETF Shares Vital': 6634.4,
        'Vitainvest Core': 7343.8,
        'iShares Tech Growth': 11390.5,
    },
    {
        date: 'Aug 15',
        'ETF Shares Vital': 7124.6,
        'Vitainvest Core': 6903.7,
        'iShares Tech Growth': 11423.1,
    },
    {
        date: 'Aug 16',
        'ETF Shares Vital': 7934.5,
        'Vitainvest Core': 6273.6,
        'iShares Tech Growth': 12134.4,
    },
    {
        date: 'Aug 17',
        'ETF Shares Vital': 10287.8,
        'Vitainvest Core': 5900.3,
        'iShares Tech Growth': 12034.4,
    },
    {
        date: 'Aug 18',
        'ETF Shares Vital': 10323.2,
        'Vitainvest Core': 5732.1,
        'iShares Tech Growth': 11011.7,
    },
    {
        date: 'Aug 19',
        'ETF Shares Vital': 10511.4,
        'Vitainvest Core': 5523.1,
        'iShares Tech Growth': 11834.8,
    },
    {
        date: 'Aug 20',
        'ETF Shares Vital': 11043.9,
        'Vitainvest Core': 5422.3,
        'iShares Tech Growth': 12387.1,
    },
    {
        date: 'Aug 21',
        'ETF Shares Vital': 6700.7,
        'Vitainvest Core': 5334.2,
        'iShares Tech Growth': 11032.2,
    },
    {
        date: 'Aug 22',
        'ETF Shares Vital': 6900.8,
        'Vitainvest Core': 4943.4,
        'iShares Tech Growth': 10134.2,
    },
    {
        date: 'Aug 23',
        'ETF Shares Vital': 7934.5,
        'Vitainvest Core': 4812.1,
        'iShares Tech Growth': 9921.2,
    },
    {
        date: 'Aug 24',
        'ETF Shares Vital': 9021.0,
        'Vitainvest Core': 2729.1,
        'iShares Tech Growth': 10549.8,
    },
    {
        date: 'Aug 25',
        'ETF Shares Vital': 9198.2,
        'Vitainvest Core': 2178.0,
        'iShares Tech Growth': 10968.4,
    },
    {
        date: 'Aug 26',
        'ETF Shares Vital': 9557.1,
        'Vitainvest Core': 2158.3,
        'iShares Tech Growth': 11059.1,
    },
    {
        date: 'Aug 27',
        'ETF Shares Vital': 9959.8,
        'Vitainvest Core': 2100.8,
        'iShares Tech Growth': 11903.6,
    },
    {
        date: 'Aug 28',
        'ETF Shares Vital': 10034.6,
        'Vitainvest Core': 2934.4,
        'iShares Tech Growth': 12143.3,
    },
    {
        date: 'Aug 29',
        'ETF Shares Vital': 10243.8,
        'Vitainvest Core': 3223.4,
        'iShares Tech Growth': 12930.1,
    },
    {
        date: 'Aug 30',
        'ETF Shares Vital': 10078.5,
        'Vitainvest Core': 3779.1,
        'iShares Tech Growth': 13420.5,
    },
    {
        date: 'Aug 31',
        'ETF Shares Vital': 11134.6,
        'Vitainvest Core': 4190.3,
        'iShares Tech Growth': 14443.2,
    },
];

const valueFormatter = (number: number) =>
    `$${Intl.NumberFormat('us').format(number).toString()}`;

export const WalletOverviewLineChart = React.memo(() => {
    return (
        <LineChart
            categories={[
                'ETF Shares Vital',
                'Vitainvest Core',
                'iShares Tech Growth',
            ]}
            className="hidden sm:block"
            colors={['blue', 'violet', 'emerald']}
            data={data}
            index="date"
            showTooltip={true}
            valueFormatter={valueFormatter}
            yAxisWidth={60}
            onValueChange={() => {}}
        />
    );
});
