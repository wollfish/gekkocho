import { Divider } from '@nextui-org/divider';

import { getProfile } from '@/actions/dashboard/settings';
import { TwoFactorAuthFormModal } from '@/app/dashboard/settings/security/TwoFactorAuthFormModal';
import { UpdatePasswordForm } from '@/app/dashboard/settings/security/UpdatePasswordForm';
import { description, subtitle } from '@/components/primitives';
import { DataPageTemplate } from '@/lib/misc/DataPageTemplate';

export const dynamic = 'force-dynamic';

export default async function SecurityPage() {
    const { success, data: user, error: useError } = await getProfile();
    const _2faText = 'To set up 2FA, go to Settings > Security, click "Enable 2FA", scan QR code with authenticator app, and enter verification code to confirm';

    if (!success) {
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
        <DataPageTemplate error={useError}>
            <section className="space-y-8 py-4">
                <div className="mt-4 grid grid-cols-7">
                    <div className="col-span-3">
                        <h2 className={subtitle()}>Change Password</h2>
                        <p className={description({ className: 'm-0', size: 'xs' })}>
                            Account compromised? Change your password.
                        </p>
                    </div>
                    <UpdatePasswordForm/>
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
                                    Two-Factor Authentication (2FA) adds a second verification step to the login
                                    process.
                                </p>
                                <TwoFactorAuthFormModal user={user}/>
                            </div>
                            <Divider/>
                            <p>{_2faText}</p>
                        </div>
                    </div>
                </div>
            </section>
        </DataPageTemplate>
    );
}
