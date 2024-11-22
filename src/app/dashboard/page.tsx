import { PaymentOverviewCharts } from '@/app/dashboard/payments/utils/PaymentOverviewCharts';
import { title } from 'src/components/primitives';

export default function DashboardPage() {
    return (
        <div>
            <h1 className={title({ fullWidth: true })}>DashBoard</h1>
            <PaymentOverviewCharts/>
        </div>
    );
}
