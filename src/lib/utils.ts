import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
