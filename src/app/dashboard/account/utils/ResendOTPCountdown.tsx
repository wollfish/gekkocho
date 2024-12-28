'use client';

import React, { useState, useEffect, useRef } from 'react';

type ResendOTPCountdownProps = {
    initialCountdown: number;
    onResend: () => Promise<void>;
};

export const ResendOTPCountdown: React.FC<ResendOTPCountdownProps> = (props) => {
    const { initialCountdown, onResend } = props;

    const [timeLeft, setTimeLeft] = useState(initialCountdown);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }

        return () => clearInterval(intervalRef.current!);
    }, [timeLeft]);

    const handleResend = async () => {
        setIsLoading(true);
        try {
            await onResend();
            setTimeLeft(initialCountdown);
        } catch {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {timeLeft > 0 ? (
                <p>
                    Didn’t receive OTP yet? Resend in {timeLeft} seconds
                </p>
            ) : (
                <button disabled={isLoading} onClick={handleResend}>
                    {isLoading ? 'Resending...' : 'Resend OTP'}
                </button>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};
