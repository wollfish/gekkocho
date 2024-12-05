import { redirect, RedirectType } from 'next/navigation';

export default function PayPage() {
    redirect ('/dashboard/beneficiaries/fiat', RedirectType.replace );
}
