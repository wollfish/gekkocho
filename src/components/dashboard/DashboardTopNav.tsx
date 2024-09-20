'use client';

import React from 'react';

import { Avatar } from '@nextui-org/avatar';
import { Badge } from '@nextui-org/badge';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { Input } from '@nextui-org/input';
import { Kbd } from '@nextui-org/kbd';

import { doLogout } from '@/actions/auth';
import { Icons, SearchIcon } from '@/components/icons';
import { ThemeSwitch } from '@/components/theme-switch';

export const DashboardTopNav: React.FC = () => {
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
        <nav className="sticky top-0 z-10 flex h-16 min-h-16 w-full border-b border-divider bg-background px-6">
            <header className="flex grow items-center justify-between gap-4 text-default">
                <div className="flex items-center gap-4">
                    {searchInput}
                </div>
                <div className="flex items-center gap-4">
                    <Badge isDot color="primary" content="" shape="circle" size="sm">
                        <Icons.bell fill="currentColor" size={20}/>
                    </Badge>
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
                                name="Jason Hughes"
                                size="sm"
                                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2" textValue="profile">
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold">zoey@example.com</p>
                            </DropdownItem>
                            <DropdownItem key="settings" textValue="settings">My Settings</DropdownItem>
                            <DropdownItem key="team_settings" textValue="team_settings">Team Settings</DropdownItem>
                            <DropdownItem key="analytics" textValue="team_settings">Analytics</DropdownItem>
                            <DropdownItem key="system" textValue="team_settings">System</DropdownItem>
                            <DropdownItem key="configurations" textValue="team_settings">Configurations</DropdownItem>
                            <DropdownItem key="help_and_feedback" textValue="team_settings">Help &
                                Feedback</DropdownItem>
                            <DropdownItem key="logout" className="text-danger" color="danger" textValue="team_settings"
                                onClick={handleLogout}>
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </header>
        </nav>
    );
};
