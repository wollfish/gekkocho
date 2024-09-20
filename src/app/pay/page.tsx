import { redirect, RedirectType } from 'next/navigation';

export default function PayPage() {
    redirect  ('/', RedirectType.replace );
}
