import { Button } from '@nextui-org/button';

import { doLogout } from '@/actions/auth';

export function SignOut() {
    return (
        <form action={doLogout}>
            <Button type="submit">Sign Out</Button>
        </form>
    );
}
