import React from 'react';

import Image from 'next/image';
import NextLink from 'next/link';

import { Icons } from '@/components/icons';
import { Services } from '@/components/landingPage/services';
import { LogoCarousel } from '@/components/logo-carousel';
import { PayConfirm } from '@/components/paymentPage/payConfirm';
import { PayCTA } from '@/components/paymentPage/payCTA';
import { PayWidget } from '@/components/paymentPage/payWidget';
import { description, link, subtitle, title } from '@/components/primitives';
import { Meteors } from '@/components/ui/meteors';
import { pageConstants } from '@/constant';

export default function Home() {
    return (
        <React.Fragment>
            <section
                className="relative z-20 col-span-4 mb-16 flex flex-1 flex-col items-center overflow-hidden pt-8 transition-all duration-1000 md:mb-28 md:pt-16"
            >
                <div
                    className="mx-auto mb-16 grid w-full flex-1 grid-cols-1 px-4 pt-10 md:mb-48 lg:w-[1080px] lg:grid-cols-4 lg:px-0">
                    <div className="col-span-2">
                        <h1 className="mb-5">
                            <span className={title()}>Accept&nbsp;</span>
                            <span className={title({ color: 'violet' })}>Payments</span>
                            <br/>
                            <span className={title({ color: 'yellow' })}>
                                in crypto within seconds
                            </span>
                        </h1>
                        <span className="mb-8 flex w-full text-sm  text-gray-600 lg:text-base">
                            Enhance revenue by improving conversion rates with global payment acceptance, featuring instant settlement and payouts, all customized to meet the unique needs of each business.
                        </span>
                        <NextLink className={link().base({ type: 'solid' })} href="/login">
                            <span>Get Started</span>
                            <Icons.arrowRight className={link().icon()}/>
                        </NextLink>
                        <div className="mx-auto flex flex-col items-start space-y-4 py-16">
                            <p className=" w-full text-sm lg:w-[500px]">
                                &quot;CoinDhan Pay eliminated the hassle and complexity of payments. They&apos;re more
                                than a payment service; they’re an essential partner for our product&quot;
                            </p>
                            <div className="flex items-center space-x-3">
                                <Image
                                    alt="gameshift"
                                    className="size-6 rounded-2xl object-contain"
                                    height="60"
                                    src="https://pbs.twimg.com/profile_images/1743115956568678400/9XjgNzuT_400x400.jpg"
                                    width="60"
                                />
                                <p className="text-xs text-gray-600">
                                    Davis, Product Lead at Solana Gameshift
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="group col-span-2 mx-auto">
                        <div className="relative">
                            <PayWidget/>
                            <div
                                className="absolute left-2/3 top-16 hidden transition-all group-hover:left-[80%] md:block">
                                <PayCTA/>
                            </div>
                            <div
                                className="absolute -bottom-10 right-2/3 hidden transition-all group-hover:right-[80%] md:block"
                            >
                                <PayConfirm/>
                            </div>
                        </div>
                    </div>
                </div>
                <LogoCarousel className="lg:w-3/4"/>
            </section>
            <section
                className="relative z-20 mx-auto grid w-full translate-y-0 py-8 opacity-100 transition-all duration-1000 md:py-28 lg:w-[1080px] lg:grid-cols-4">
                <div className="col-span-4 mb-16 flex flex-col gap-6 text-center lg:col-span-2 lg:col-start-2">
                    <h2 className={title({ size: 'sm' })}>
                        Elevate your earnings with modern payments technology
                    </h2>
                    <p className={description({ size: 'md' })}>
                        Reduce costs, grow revenue, and run your business more efficiently on a fully integrated
                        platform. Use Coinflow to handle all of your payments-related needs, manage revenue operations,
                        and launch (or invent) new business models
                    </p>
                </div>
                <Services/>
            </section>
            <section className="w-full py-8 md:py-28">
                <div className="relative z-20 mx-auto grid w-full translate-y-0 grid-cols-4 lg:w-[1080px] ">
                    <div className="relative col-span-4 grid grid-cols-1 lg:grid-cols-2">
                        <div>
                            <div className="sticky top-32 flex flex-col pr-8">
                                <div className="absolute h-10 w-px bg-blue-500"/>
                                <div className="ml-4">
                                    <h2 className={title({ size: 'sm' })}>
                                        Crypto payments for every business
                                    </h2>
                                    <p className={description({ className: 'mb-4' })}>
                                        Crypto payment is perfect for any business model and can be easily integrated
                                        into your existing operations or set up as a brand new service. We cover
                                        everyone from Forex and Crypto brokers to gaming!
                                    </p>
                                    <NextLink className={link().base()} href="/about">
                                        <span>Contact sales</span>
                                        <Icons.arrowRight className={link().icon()}/>
                                    </NextLink>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:mt-auto">
                            {Object.values(pageConstants.landing.useCases).map((item) => (
                                <div key={item.key} className="mb-16 flex flex-col space-y-4">
                                    <h3 className={subtitle({
                                        className: 'flex border-l border-blue-600 pl-4',
                                        size: 'base',
                                    })}>
                                        <item.icon className="mr-4 text-blue-600" size={24}/>
                                        {item.title}
                                    </h3>
                                    <p className={description({ size: 'xs', className: 'px-4' })}>
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full py-8 md:py-28">
                <div className="relative z-20 mx-auto grid w-full translate-y-0 grid-cols-4 lg:w-[1080px]">
                    <div className="relative col-span-4 grid grid-cols-1 lg:grid-cols-2">
                        <div>
                            <div className="sticky top-32 flex flex-col pr-8">
                                <div className="absolute h-10 w-px bg-yellow-500"/>
                                <div className="ml-4">
                                    <h2 className={title({ size: 'sm' })}>
                                        Crypto vs Cards/Fiat
                                    </h2>
                                    <p className={description({ className: 'mb-4' })}>
                                        Crypto payments have many advantages compared with traditional Fiat payment
                                        methods. eg. Crypto payments are cheaper, faster, and more secure than
                                        traditional payment methods. See the facts for yourself!
                                    </p>
                                    <NextLink className={link().base()} href="/about">
                                        <span>Contact sales</span>
                                        <Icons.arrowRight className={link().icon()}/>
                                    </NextLink>
                                </div>
                            </div>
                        </div>
                        <div
                            className="relative mt-12 whitespace-nowrap border-t border-dashed bg-gray-200/10 dark:border-default lg:mt-0">
                            <div className="absolute h-12 w-px bg-yellow-500"/>
                            <div className="flex border-b border-dashed p-3 font-semibold dark:border-default">
                                <span className="w-1/3">Features</span>
                                <span className="w-1/3 text-center">Crypto Payments</span>
                                <span className="w-1/3 text-center">Fiat Payments</span>
                            </div>
                            {pageConstants.landing.cryptoVsFiat.map((item) => (
                                <div
                                    key={item.feature}
                                    className="flex justify-between border-b border-dashed p-3 text-sm text-default-500 dark:border-default"
                                >
                                    <span className="w-1/3 font-semibold">{item.feature}</span>
                                    <span className="flex w-1/3 items-center justify-center">
                                        {item.crypto === 'yes'
                                            ? <Icons.check className="text-green-500"/> : item.crypto === 'no'
                                                ? <Icons.cancel className="text-red-500"/> : item.crypto
                                        }
                                    </span>
                                    <span className="flex w-1/3 items-center justify-center">
                                        {item.fiat === 'yes'
                                            ? <Icons.check className="text-green-500"/> : item.fiat === 'no'
                                                ? <Icons.cancel className="text-red-500"/> : item.fiat
                                        }
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <section className="relative z-20 mx-auto grid w-full py-8 md:py-28 lg:w-[1080px] lg:grid-cols-4">
                <div className="relative col-span-4 lg:col-span-2">
                    <div>
                        <div className="sticky top-32 flex flex-col pr-8">
                            <div className="absolute h-10 w-px bg-orange-500"/>
                            <div className="ml-4">
                                <h2 className={title({ size: 'sm' })}>
                                    How crypto payments works?
                                </h2>
                                <p className={description({ className: 'mb-4' })}>
                                    A cryptocurrency payment gateway works in just 4 easy steps: choosing a payment
                                    method, selecting a currency, transferring funds to the deposit address,
                                    and receiving the payment in your preferred cryptocurrency.
                                </p>
                                <NextLink className={link().base()} href="/about">
                                    <span>Learn more</span>
                                    <Icons.arrowRight className={link().icon()}/>
                                </NextLink>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-4 md:col-span-2">
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:mt-auto">
                        {Object.values(pageConstants.landing.cryptoSteps).map((item) => (
                            <div key={item.key} className="mb-16 flex flex-col space-y-4">
                                <h3 className={subtitle({
                                    className: 'flex border-l border-orange-600 pl-4',
                                    size: 'base',
                                })}>
                                    <item.icon className="mr-4 text-orange-600" size={24}/>
                                    <span>{item.title}</span>
                                </h3>
                                <p className={description({ size: 'xs', className: 'px-4' })}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="relative z-20 mx-auto grid w-full py-8 md:py-28 lg:w-[1080px] lg:grid-cols-4">
                <div className="relative col-span-4 lg:col-span-2">
                    <div>
                        <div className="sticky top-32 flex flex-col pr-8">
                            <div className="absolute h-10 w-px bg-blue-500"/>
                            <div className="ml-4">
                                <h2 className={title({ size: 'sm' })}>
                                    Easy integration and setup
                                </h2>
                                <p className={description({ className: 'mb-4' })}>
                                    CoinDhan crypto payment gateway integrates seamlessly with
                                    WordPress, Magento, Opencart, Prestashop, Laravel, PHP and Node.js for consuming
                                    payment gateway services without leaving the website.
                                </p>
                                <NextLink className={link().base()} href="/about">
                                    <span>Learn more</span>
                                    <Icons.arrowRight className={link().icon()}/>
                                </NextLink>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative col-span-4 lg:col-span-2">
                    <div>
                        <Image
                            alt=""
                            className="mx-auto max-w-xs"
                            height={300}
                            src="https://cdn.rareblocks.xyz/collection/celebration/images/integration/2/services-icons.png"
                            width={300}
                        />
                    </div>
                </div>
            </section>
            <section className="relative z-20 mx-auto grid w-full py-8 md:py-28 lg:w-[1080px] lg:grid-cols-4">
                <div
                    className="relative col-span-4 grid space-y-12 overflow-hidden rounded-xl bg-neutral-950 p-12 text-center text-neutral-50">
                    <h2 className={title({ size: 'sm' })}>
                        <span>Start accepting payments in</span>
                        <br/>
                        <span className={title({ size: 'sm', color: 'yellow' })}>crypto now!</span>
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <NextLink className={link().base({
                            type: 'solid',
                            className: 'text-sm shadow-xl shadow-blue-500/20',
                        })} href="/about">
                            <span>Get Started</span>
                            <Icons.arrowRight className={link().icon()}/>
                        </NextLink>
                        <NextLink className={link().base({ type: 'outline', size: 'xs' })} href="/public">
                            <Icons.video/>
                            <span>Watch Video</span>
                        </NextLink>
                    </div>
                    <p className={description()}>
                        Join the thousands of users who have already started accepting crypto payments.
                        <br/>
                        Support is just a few taps away. Get your questions answered by using our help library.
                    </p>
                    <Meteors number={15} position={800}/>
                </div>
            </section>
        </React.Fragment>
    );
}
