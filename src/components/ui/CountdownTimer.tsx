'use client';

import React, { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface OwnProps {
    startTime?: string;
    endTime: string;
}

export const CountdownTimer: React.FC<OwnProps> = (props) => {
    const { startTime, endTime } = props;

    const calculateRemainingTime = () => {
        const now = Date.now();
        const start = startTime ? new Date(startTime).getTime() : now;
        const end = new Date(endTime).getTime();

        return Math.max(end - start, 0); // Ensure it doesn't go below 0

    };

    const intervalRef = useRef(null);
    const [remainingTime, setRemainingTime] = useState(() => calculateRemainingTime());

    useEffect(() => {
        if (remainingTime === 0) return;

        intervalRef.current = setInterval(() => {
            setRemainingTime((prevTime) => Math.max(prevTime - 1000, 0)); // Update and stop at 0
        }, 1000);

        return () => clearInterval(intervalRef.current); // Clean up interval
    }, [remainingTime]);

    const getTimeUnits = (ms: number) => {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);

        return {
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0'),
        };
    };

    const { hours, minutes, seconds } = getTimeUnits(remainingTime);

    return (
        <div className={cn('flex items-center', { 'text-danger': remainingTime <= 100000 })}>
            <span>{hours}:</span>
            <span>{minutes}:</span>
            <span>{seconds}</span>
        </div>
    );
};
