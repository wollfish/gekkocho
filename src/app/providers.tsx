'use client';

import * as React from 'react';
import { NextUIProvider } from '@nextui-org/system';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { Toaster } from 'sonner';

interface ProvidersProps {
    children?: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

export const Providers: React.FC<ProvidersProps> = (props) => {
    const { children, themeProps } = props;

    const router = useRouter();

    return (
        <NextUIProvider navigate={router.push}>
            <NextThemesProvider {...themeProps}>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </NextThemesProvider>
        </NextUIProvider>
    );
};

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const { theme }= useTheme();

    return (
        <React.Fragment>
            <Toaster richColors position="top-right" theme={theme as 'light' | 'dark'}/>
            {children}
        </React.Fragment>
    );
};
