import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';

import { Input } from '@nextui-org/input';

import { Switch } from '@nextui-org/switch';

import { description, subtitle } from '@/components/primitives';

export default async function SecurityPage() {
    const _2faText = 'To set up 2FA, go to Settings > Security, click "Enable 2FA", scan QR code with authenticator app, and enter verification code to confirm';

    return (
        <section className="space-y-8 py-4">
            <div className="mt-4 grid grid-cols-7">
                <div className="col-span-3">
                    <h2 className={subtitle()}>Change Password</h2>
                    <p className={description({ className: 'm-0', size: 'xs' })}>
                        Account compromised? Change your password.
                    </p>
                </div>
                <form className="col-span-4 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div className="flex flex-col gap-2">
                        <Input label="Current Password" size="sm" type="password"/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Input label="New Password" size="sm" type="password"/>
                    </div>
                    <div/>
                    <div className="flex justify-end gap-2">
                        <Button className="" type="reset" variant="flat">Cancel</Button>
                        <Button className="" color="primary" type="submit">Update Password</Button>
                    </div>
                </form>
            </div>
            <Divider/>
            <div className="mt-4 grid grid-cols-7">
                <div className="col-span-3">
                    <h2 className={subtitle()}>Two-factor Authentication</h2>
                    <p className={description({ className: 'm-0', size: 'xs' })}>
                        Enable or disable two-factor authentication.
                    </p>
                </div>
                <form className="col-span-4 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div className="col-span-2 space-y-4 rounded-lg bg-default-100/50 p-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <p className={description({ size: 'xs' })}>
                                Two-Factor Authentication (2FA) adds a second verification step to the login process.
                            </p>
                            <Switch/>
                        </div>
                        <Divider/>
                        <p>{_2faText}</p>
                    </div>
                </form>
            </div>
        </section>
    );
}
