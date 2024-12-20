'use client';

import * as React from 'react';
import { NextUIProvider } from '@nextui-org/system';
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { Toaster } from 'sonner';

interface ProvidersProps {
    children?: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // With SSR, we usually want to set some default staleTime
                // above 0 to avoid refetching immediately on the client
                staleTime: 60 * 1000,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
    if (isServer) {
        // Server: always make a new query client
        return makeQueryClient();
    } else {
        // Browser: make a new query client if we don't already have one
        // This is very important, so we don't re-make a new client if React
        // suspends during the initial render. This may not be needed if we
        // have a suspense boundary BELOW the creation of the query client
        if (!browserQueryClient) browserQueryClient = makeQueryClient();

        return browserQueryClient;
    }
}

export const Providers: React.FC<ProvidersProps> = (props) => {
    const { children, themeProps } = props;

    const router = useRouter();

    // NOTE: Avoid useState when initializing the query client if you don't
    //       have a suspense boundary between this and the code that may
    //       suspend because React will throw away the client on the initial
    //       render if it suspends and there is no boundary
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false}/>
            <NextUIProvider navigate={router.push}>
                <NextThemesProvider {...themeProps}>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </NextThemesProvider>
            </NextUIProvider>
        </QueryClientProvider>
    );
};

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const { theme } = useTheme();

    return (
        <React.Fragment>
            <Toaster
                closeButton={true}
                position="top-right"
                richColors={true}
                theme={theme as 'light' | 'dark'}
            />
            {children}
        </React.Fragment>
    );
};
