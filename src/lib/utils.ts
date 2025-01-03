import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { CurrencyResponseInterface, PaymentMethodInterface } from '@/lib/zod';

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

export const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
export const truncateText = (text: string, length: number = 24, direction: 'end' | 'middle' = 'end'): string => {
    if (text.length <= length) {
        return text;
    }

    const ellipsis = '...';
    const ellipsisLength = ellipsis.length;

    if (direction === 'end') {
        return text.slice(0, length - ellipsisLength) + ellipsis;
    } else if (direction === 'middle') {
        const halfLength = (length - ellipsisLength) / 2;
        const start = text.slice(0, Math.ceil(halfLength));
        const end = text.slice(-Math.floor(halfLength));

        return `${start}${ellipsis}${end}`;
    }
};

export const generateRandomId = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = 'payid-';

    for (let i = 0; i < 10; i++) {
        randomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return randomId;
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
        console.error('Currency not found');

        return [0, 0];
    }

    const conversionRate = +toCurrency.exchange_rate / +fromCurrency.exchange_rate;
    const convertedAmount = +amount / conversionRate;

    return [convertedAmount, conversionRate];
};

export const convertAmountInMainCurrency = (amount: string | number, mainCurrency: CurrencyResponseInterface) => {
    if (!mainCurrency) {
        return 0;
    }

    return +amount * +mainCurrency.price;
};

export const convertAmount = (amount: string | number, fromCurrency: CurrencyResponseInterface, toCurrency: CurrencyResponseInterface) => {
    if (!fromCurrency || !toCurrency) {
        console.error('Currency not found');

        return [0, 0];
    }

    const conversionRate = +toCurrency.price / +fromCurrency.price;
    const convertedAmount = +amount / conversionRate;

    return [convertedAmount, conversionRate];
};

export const formatNumber = (number: string | number) => {
    if (!+number) {
        return number;
    }

    const formatter = new Intl.NumberFormat('en-US');

    return formatter.format(+number);
};
