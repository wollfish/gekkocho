import { redirect, RedirectType } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Page() {
    redirect ('/dashboard/beneficiaries/fiat', RedirectType.replace );
}
