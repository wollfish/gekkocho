import { redirect, RedirectType } from 'next/navigation';

export default function SettingsPage() {
    redirect  ('/dashboard/settings/general', RedirectType.replace );
}
