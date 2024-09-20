import 'server-only';
import React from 'react';

import { Divider } from '@nextui-org/divider';
import NextLink from 'next/link';

import { Logo } from '@/components/icons';
import { description, subtitle } from '@/components/primitives';
import { ThemeSwitch } from '@/components/theme-switch';

export const Footer: React.FC = async () => {
    return (
        <footer
            className="relative z-20 w-full border-t border-dashed border-black/5 bg-default-50/50 dark:border-slate-900">
            <section className="mx-auto w-full py-12 lg:w-[1080px]">
                <div className="grid grid-cols-4 [&_li]:mb-2">
                    <div className="relative col-span-4 px-4 md:col-span-1">
                        <span className="absolute left-0 h-6 w-px bg-orange-500"/>
                        <h3 className={subtitle({ className: 'relative mb-2', size: 'sm' })}>
                            <span>Locate us</span>
                        </h3>
                        <p className={description({ size: 'xs' })}>
                            Wollfish Labs Private Limited, PLOT 76-D, UDYOG VIHAR PHASE 4,
                            GURUGRAM, Gurgaon, Haryana, 122001
                        </p>
                    </div>
                    <div className="relative col-span-2 px-4 md:col-span-1">
                        <span className="absolute left-0 h-6 w-px bg-orange-500"/>
                        <h3 className={subtitle({ className: 'relative mb-2', size: 'sm' })}>
                            <span>Company</span>
                        </h3>
                        <ul className="font-medium text-gray-500 dark:text-gray-400">
                            <li>
                                <a className="hover:underline " href="https://github.com/themesberg/flowbite">Github</a>
                            </li>
                            <li>
                                <a className="hover:underline" href="https://discord.gg/4eeurUVvTy">Discord</a>
                            </li>
                            <li>
                                <a className="hover:underline" href="https://discord.gg/4eeurUVvTy">Discord</a>
                            </li>
                        </ul>
                    </div>
                    <div className="relative col-span-2 px-4 md:col-span-1">
                        <span className="absolute left-0 h-6 w-px bg-orange-500"/>
                        <h3 className={subtitle({ className: 'relative mb-2', size: 'sm' })}>
                            <span>Important Links</span>
                        </h3>
                        <ul className="font-medium text-gray-500 dark:text-gray-400">
                            <li>
                                <a className="hover:underline " href="https://github.com/themesberg/flowbite">Github</a>
                            </li>
                            <li>
                                <a className="hover:underline" href="https://discord.gg/4eeurUVvTy">Discord</a>
                            </li>
                            <li>
                                <a className="hover:underline" href="https://discord.gg/4eeurUVvTy">Discord</a>
                            </li>
                        </ul>
                    </div>
                    <div className="relative col-span-4 px-4 md:col-span-1">
                        <span className="absolute left-0 h-6 w-px bg-orange-500"/>
                        <h3 className={subtitle({ className: 'relative mb-2', size: 'sm' })}>
                            <span>Support</span>
                        </h3>
                        <ul className="font-medium text-gray-500 dark:text-gray-400">
                            <li>
                                <a className="hover:underline " href="https://github.com/themesberg/flowbite">Github</a>
                            </li>
                            <li>
                                <a className="hover:underline" href="https://discord.gg/4eeurUVvTy">Discord</a>
                            </li>
                            <li>
                                <a className="hover:underline" href="https://discord.gg/4eeurUVvTy">Discord</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <Divider className="my-4"/>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <NextLink className="flex items-center justify-start gap-1" href="/">
                        <Logo/>
                        <p className="font-bold text-inherit">CoinDhan Pay</p>
                    </NextLink>
                    <p className="text-xs">© 2024 CoinDhan Pay. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <ThemeSwitch/>
                    </div>
                </div>
            </section>
        </footer>
    );
};
