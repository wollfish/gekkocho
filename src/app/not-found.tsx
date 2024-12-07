import React from 'react';
import { Button } from '@nextui-org/button';
import NextLink from 'next/link';

import { Icons } from '@/components/icons';
import { Navbar } from '@/components/navbar';
import { description } from '@/components/primitives';
import { BackgroundGradient } from '@/components/ui/BackgroundGradient';
import { GoBackBtn } from '@/lib/misc/goBackBtn';

export default async function NotFound() {
    return (
        <section className="flex h-screen overflow-hidden">
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                <Navbar/>
                <main className="z-10 size-full p-4">
                    <div className="m-auto flex size-full flex-col items-center justify-center">
                        <h2>Sorry, the page can’t be found</h2>
                        <p className={description({ size: 'xs', className: 'text-center mb-8' })}>
                            The page you were looking for appears to have been moved, deleted or does not exist.
                        </p>
                        <div className="flex gap-4">
                            <Button
                                as={NextLink}
                                className="text-sm"
                                color="primary"
                                href="/"
                                radius="full"
                                size="lg"
                                variant="bordered"
                            >
                                <Icons.home/>
                                <span>Homepage</span>
                            </Button>
                            <GoBackBtn/>
                        </div>
                    </div>
                </main>
                <BackgroundGradient/>
            </div>
        </section>
    );
}
