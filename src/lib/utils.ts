import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { PaymentMethodInterface } from '@/lib/zod';

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

export const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncateTo32Chars = (input: string): string => {
    if (input.length <= 32) {
        return input;
    }
    const start = input.slice(0, 10);
    const end = input.slice(-10);

    return `${start}...${end}`;
};

const genArrayArg = (key: string, values: any[]): string =>
    values.map((value) => `${key}[]=${encodeURIComponent(value)}`).join('&');

const genPlainArg = (key: string, value: any): string =>
    `${key}=${encodeURIComponent(value)}`;

const isEmptyValue = (value: any): boolean =>
    value === '' || value === null || value === undefined || (Array.isArray(value) && value.length === 0);

export const buildQueryString = (action: Record<string, any>, excludeKeys: string[] = []): string => {
    const queryString = Object.entries(action)
        .filter(([key, value]) =>
            !excludeKeys.includes(key) && !isEmptyValue(value)
        )
        .map(([key, value]) =>
            Array.isArray(value) ? genArrayArg(key, value) : genPlainArg(key, value)
        )
        .join('&');

    return queryString ? `?${queryString}` : '';
};

export const convertCurrency = (currencies: PaymentMethodInterface[], amount: string | number, fromCurrencyId: string, toCurrencyId: string) => {
    const fromCurrency = currencies.find((currency) => currency.id === fromCurrencyId);
    const toCurrency = currencies.find((currency) => currency.id === toCurrencyId);

    if (!fromCurrency || !toCurrency) {
        throw new Error('Invalid currency IDs');
    }

    const conversionRate = +toCurrency.exchange_rate / +fromCurrency.exchange_rate;
    const convertedAmount = +amount / conversionRate;

    return [convertedAmount, conversionRate];
};
