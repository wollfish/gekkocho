'use client';

import React from 'react';

import { DATE_FORMAT, localeDate } from '@/lib/localeDate';

interface OwnProps {
    date: string | number | Date
    format: keyof typeof DATE_FORMAT
}

export const YukiDateFormat: React.FC<OwnProps> = (props) => {
    const { date, format } = props;

    return (
        <span>{localeDate(date, format)}</span>
    );
};
