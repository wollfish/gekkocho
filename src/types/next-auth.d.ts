import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            access_token: string;
            csrf_token: string;
        } & DefaultSession['user'];
    }
}
