'use client';

import React from 'react';

import { Avatar } from '@nextui-org/avatar';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { Input } from '@nextui-org/input';
import { Kbd } from '@nextui-org/kbd';

import { useSession } from 'next-auth/react';

import { doLogout } from '@/actions/auth';
import { SearchIcon } from '@/components/icons';
import { ThemeSwitch } from '@/components/theme-switch';
import { NetworkStatusIndicator } from '@/lib/misc/NetworkStatusAlerts';

export const DashboardTopNav: React.FC = () => {
    const session = useSession();

    const handleLogout = async () => {
        await doLogout();
    };

    const searchInput = (
        <Input
            aria-label="Search"
            classNames={{
                inputWrapper: 'bg-default-100',
                input: 'text-sm',
            }}
            endContent={
                <Kbd className="hidden lg:inline-block" keys={['command']}>
                    K
                </Kbd>
            }
            labelPlacement="outside"
            placeholder="Search..."
            startContent={
                <SearchIcon className="pointer-events-none shrink-0 text-base text-default-400"/>
            }
            type="search"
        />
    );

    return (
        <nav
            className="sticky top-0 z-10 flex h-16 min-h-16 w-full border-b border-divider bg-background px-6 print:hidden">
            <header className="flex grow items-center justify-between gap-4 text-default">
                <div className="flex items-center gap-4">
                    {searchInput}
                </div>
                <div className="flex items-center gap-4">
                    {/*<Badge isDot color="primary" content="" shape="circle" size="sm">*/}
                    {/*    <Icons.bell fill="currentColor" size={20}/>*/}
                    {/*</Badge>*/}
                    <NetworkStatusIndicator/>
                    <ThemeSwitch/>
                    <Dropdown
                        classNames={{
                            content: 'bg-default-50/50 backdrop-blur-md',
                        }}
                        placement="bottom-end"
                    >
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                color="primary"
                                name="R"
                                size="sm"
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2" textValue="profile">
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold">{session.data?.user?.email}</p>
                            </DropdownItem>
                            <DropdownItem key="settings" textValue="settings">My Settings</DropdownItem>
                            <DropdownItem key="team_settings" textValue="team_settings">Team Settings</DropdownItem>
                            <DropdownItem key="analytics" textValue="analytics">Analytics</DropdownItem>
                            <DropdownItem key="system" textValue="system">System</DropdownItem>
                            <DropdownItem key="configurations" textValue="configurations">Configurations</DropdownItem>
                            <DropdownItem key="help_and_feedback" textValue="help_and_feedback">
                                Help & Feedback
                            </DropdownItem>
                            <DropdownItem
                                key="logout"
                                className="text-danger"
                                color="danger"
                                textValue="team_settings"
                                onClick={handleLogout}
                            >
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </header>
        </nav>
    );
};
