import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

export const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
