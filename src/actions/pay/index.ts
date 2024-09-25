export const getPaymentInfo = async (payload: { payment_id: string }) => {
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/payment/info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            cache: 'no-store',
        });

        const res = await data.json();

        if (!data.ok) {
            return { success: false, error: res?.error, data: null };
        }

        console.warn('getPaymentInfo - data', res);

        return { success: true, error: null, data: res };
    } catch (e) {
        throw e;
    }
};
