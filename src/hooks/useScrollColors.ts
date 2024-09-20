import { useCallback, useState } from 'react';
import { useDebounceFn, useEventListener } from 'ahooks';

const TOTAL_RANGE = 100;

const getColorCombinationsInRange = (colors: string[], shades: number[], value: number): string[] => {
    const colorRange = TOTAL_RANGE / colors.length;

    if (!isFinite(value)) {
        console.warn('Invalid value passed to getColorCombinationsInRange');

        return [];
    }

    return colors.reduce((combinations, color, index) => {
        if (value >= index * colorRange && value <= (index + 1) * colorRange) {
            shades.forEach((shade: number) => combinations.push(`${color}-${shade}`));
        }

        return combinations;
    }, [] as string[]);
};

export const useScrollColors = (colors: string[], shades: number[]) => {
    const [bgColors, setBgColors] = useState(() => getColorCombinationsInRange(colors, shades, 0));
    const [scrollPercentage, setScrollPercentage] = useState(0);

    const debouncedFun = useCallback(() => {
        const scrollY = window.scrollY;
        const scrollPercentage = (scrollY / (document.body.offsetHeight - window.innerHeight)) * 100;
        const newColors = getColorCombinationsInRange(colors, shades, scrollPercentage);

        setBgColors(newColors);
        setScrollPercentage(scrollPercentage);
    }, [colors, shades]);

    const { run } = useDebounceFn(debouncedFun, { wait: 80 });

    useEventListener('scroll', run);

    return [bgColors, scrollPercentage] as const;
};
