'use client';

import React, { useState } from 'react';
import { Input } from '@nextui-org/input';
import { UseInputProps } from '@nextui-org/input/dist/use-input';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@nextui-org/shared-icons';

export const InputPassword = React.forwardRef<HTMLInputElement, UseInputProps>(({ ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <Input
            ref={ref}
            autoComplete="off"
            endContent={
                <button className="focus:outline-none" type="button" onClick={() => setIsVisible((p) => !p)}>
                    {isVisible ? (
                        <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400"/>
                    ) : (
                        <EyeFilledIcon className="pointer-events-none text-2xl text-default-400"/>
                    )}
                </button>
            }
            type={isVisible ? 'text' : 'password'}
            {...props}
        />
    );
});
