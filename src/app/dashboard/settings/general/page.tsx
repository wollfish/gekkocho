import { Divider } from '@nextui-org/divider';
import { Snippet } from '@nextui-org/snippet';

import { getProfile } from '@/actions/dashboard/settings';
import { description, subtitle } from '@/components/primitives';

export default async function GeneralPage() {
    const user = await getProfile();

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

    const userInfo = [
        { label: 'User Id', value: user.value.uid },
        { label: 'User Name', value: user.value.username || 'N/A' },
        { label: 'Email', value: user.value.email },
        { label: 'Full Name', value: user.value.profiles[0]?.full_name || 'N/A' },
    ];

    return (
        <section className="space-y-8 py-4">
            <div className="mt-4 grid grid-cols-3">
                <div className="col-span-1">
                    <h2 className={subtitle()}>Personal Information</h2>
                    <p className={description({ className: 'm-0', size: 'xs' })}>
                        Manage your personal information.
                    </p>
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-x-8 gap-y-4 text-sm font-medium">
                    {userInfo.map((item) => (
                        <div key={item.label} className="flex flex-col gap-2">
                            <p>{item.label}</p>
                            <Snippet hideSymbol classNames={{ pre: 'font-sans' }} radius="lg" size="md">
                                {item.value}
                            </Snippet>
                        </div>
                    ))}
                </div>
            </div>
            <Divider/>
            <div className="grid grid-cols-3">
                <div className="col-span-1">
                    <h2 className={subtitle()}>Referral link</h2>
                    <p className={description({ className: 'm-0', size: 'xs' })}>
                        Refer & earn rewards and discounts.
                    </p>
                </div>
                <div className="col-span-2 grid grid-cols-1 gap-x-8 gap-y-4 text-sm font-medium">
                    <div className="flex flex-col gap-2">
                        <p>Referral Link</p>
                        <Snippet hideSymbol classNames={{ pre: 'font-sans' }} radius="lg"
                            size="md">
                            {`${process.env.AUTH_TRUST_HOST}/signup?referral_code=${user.value.uid}`}
                        </Snippet>
                    </div>
                </div>
            </div>
        </section>
    );
}
