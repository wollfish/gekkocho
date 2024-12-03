import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';

import { Input } from '@nextui-org/input';

import { getProfile } from '@/actions/dashboard/settings';
import { TwoFactorAuthFormModal } from '@/app/dashboard/settings/security/TwoFactorAuthFormModal';
import { description, subtitle } from '@/components/primitives';

export const dynamic = 'force-dynamic';

export default async function SecurityPage() {
    const user = await getProfile() as any;
    const _2faText = 'To set up 2FA, go to Settings > Security, click "Enable 2FA", scan QR code with authenticator app, and enter verification code to confirm';

    if (user.success === false) {
        return (
            <section className="m-auto">
                <h2 className={subtitle()}>Error</h2>
                <p className={description({ className: 'm-0', size: 'xs' })}>
                    {'An error occurred while fetching your profile information. Please try again later.'}
                </p>
            </section>
        );
    }

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
                        <Button className="" type="reset" variant="flat">Clear</Button>
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
                <div className="col-span-4 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div className="col-span-2 space-y-4 rounded-lg bg-default-100/50 p-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between gap-2">
                            <p className={description({ size: 'xs' })}>
                                Two-Factor Authentication (2FA) adds a second verification step to the login process.
                            </p>
                            <TwoFactorAuthFormModal user={user.value}/>
                        </div>
                        <Divider/>
                        <p>{_2faText}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
