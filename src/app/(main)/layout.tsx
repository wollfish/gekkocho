import React from 'react';

import { BgCircle } from '@/components/bgCircle';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/navbar';

export default function PublicRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex flex-col">
            <div className="relative z-10 mx-auto flex h-screen w-full flex-1 flex-col bg-background">
                <Navbar/>
                <main className="relative z-10 w-full grow bg-background/70 backdrop-blur-[100px]">
                    <div
                        className="fixed inset-y-0 left-1/2 right-0 -z-10 hidden -translate-x-1/2 grid-cols-4 border-x border-dashed border-primary/5 dark:border-slate-900 lg:grid lg:w-[1080px]">
                        <div/>
                        <div className="border-x border-dashed border-black/5 dark:border-slate-900"/>
                        <div className="border-r border-dashed border-black/5 dark:border-slate-900"/>
                    </div>
                    {children}
                    <Footer/>
                </main>
                <BgCircle/>
            </div>
        </div>
    );
}
