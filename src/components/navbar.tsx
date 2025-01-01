import 'server-only';

import React from 'react';
import { Link } from '@nextui-org/link';
import {
    Navbar as NextUINavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
} from '@nextui-org/navbar';
import { link as linkStyles } from '@nextui-org/theme';

import clsx from 'clsx';
import NextLink from 'next/link';

import { LuLogIn } from 'react-icons/lu';

import { link } from '@/components/primitives';
import { DiscordIcon, GithubIcon, Logo, TwitterIcon } from 'src/components/icons';
import { ThemeSwitch } from 'src/components/theme-switch';
import { siteConfig } from 'src/config/site';

export const Navbar: React.FC = async () => {
    return (
        <NextUINavbar className="border-1 border-dashed border-black/5" maxWidth="xl" position="sticky">
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                <NavbarBrand as="li" className="max-w-fit gap-3">
                    <NextLink className="flex items-center justify-start gap-1" href="/">
                        <Logo/>
                        <p className="font-bold text-inherit">Dome Pe</p>
                    </NextLink>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent
                className="hidden basis-1/5 font-medium sm:flex sm:basis-full"
                justify="end"
            >
                <NavbarItem className="hidden items-center sm:flex">
                    <ul className="hidden justify-start gap-4 lg:flex">
                        {siteConfig.navItems.map((item) => (
                            <NavbarItem key={item.href}>
                                <NextLink
                                    className={clsx(
                                        linkStyles({ color: 'foreground' }),
                                        'data-[active=true]:font-medium data-[active=true]:text-primary'
                                    )}
                                    color="foreground"
                                    href={item.href}
                                >
                                    {item.label}
                                </NextLink>
                            </NavbarItem>
                        ))}
                    </ul>
                    <div className="ml-6 mr-2 h-4 w-px  border-r border-dashed"/>
                    <div className="flex gap-2">
                        <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
                            <TwitterIcon className="text-default-500"/>
                        </Link>
                        <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
                            <DiscordIcon className="text-default-500"/>
                        </Link>
                        <ThemeSwitch/>
                    </div>
                    <div className="ml-2 mr-6 h-4 w-px  border-r border-dashed"/>
                    <NextLink className={link().base({ className: 'text-inherit' })} href="/login">
                        <span>Sign in</span>
                        <LuLogIn/>
                    </NextLink>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent className="basis-1 pl-4 sm:hidden" justify="end">
                <Link isExternal aria-label="Github" href={siteConfig.links.github}>
                    <GithubIcon className="text-default-500"/>
                </Link>
                <ThemeSwitch/>
                <NavbarMenuToggle/>
            </NavbarContent>

            <NavbarMenu>
                <div className="mx-4 mt-2 flex flex-col gap-2">
                    {siteConfig.navMenuItems.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link
                                color={
                                    index === 2
                                        ? 'primary'
                                        : index === siteConfig.navMenuItems.length - 1
                                            ? 'danger'
                                            : 'foreground'
                                }
                                href="#"
                                size="lg"
                            >
                                {item.label}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </div>
            </NavbarMenu>
        </NextUINavbar>
    );
};
