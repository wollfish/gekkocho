import { revalidatePath } from 'next/cache';

import { headers as next_headers } from 'next/headers';

import { auth } from '@/auth';
import { decryptToken } from '@/lib/encryption';
import { buildQueryString } from '@/lib/utils';

interface ApiRequestParams {
    endpoint: string; // API endpoint
    apiVersion: 'peatio' | 'barong';
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; // HTTP method
    payload?: Record<string, any> | null; // Request body for POST, PUT, etc.
    headers?: Record<string, string>; // Additional request headers
    cache?: boolean; // Enable caching
    pathToRevalidate?: string[];
    isPublic?: boolean;
}

export interface ApiResponse<T = any> {
    success: boolean; // Whether the request succeeded
    error: string | null; // Error message, if any
    data: T | null; // Response data, if available
}

/**
 * Perform an API request with granular control via a params object
 * @param params - Configuration for the API request
 * @returns A promise resolving to the API response
 */
export async function makeApiRequest<T = any>(params: ApiRequestParams): Promise<ApiResponse<T>> {
    const {
        endpoint,
        apiVersion,
        method = 'GET',
        payload = null,
        headers = {},
        cache = false,
        isPublic = false,
        pathToRevalidate,
    } = params;

    const session = await auth();

    const headersList = next_headers();

    const _ip = headersList.get('x-forwarded-for') || 'IP Not Found';
    const _user_agent = headersList.get('user-agent') || 'unknown';

    const endpointPath = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const barongSession = isPublic ? '' : await decryptToken(session.user?.access_token);
    const csrfToken = isPublic ? '' : await decryptToken(session.user?.csrf_token);

    let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/${apiVersion}/${endpointPath}`;

    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'Cookie': `_barong_session=${barongSession}`,
        // 'X-Forwarded-For': ip,
        // 'User-Agent': user_agent,
    };

    if (method === 'GET' && payload) {
        url += buildQueryString(payload);

    } else {
        defaultHeaders['X-CSRF-Token'] = csrfToken;
    }

    try {
        console.info('Making request :-', url);

        const res = await fetch(url, {
            method,
            headers: { ...defaultHeaders, ...headers },
            body: (method !== 'GET' && payload) ? JSON.stringify(payload) : null,
            cache: cache ? 'default' : 'no-cache',
        });

        const isSuccessful = res.ok;
        const responseData = await parseResponse<T>(res);

        if (isSuccessful) {
            if (pathToRevalidate?.length > 0) {
                for (const path of pathToRevalidate) {
                    revalidatePath(path, 'page');
                }
            }

            return { success: true, error: null, data: responseData };
        }

        console.info('API request failed', responseData);

        return {
            success: false,
            // @ts-ignore
            error: responseData?.errors?.[0] || responseData?.errors || `Error: ${res.status} ${res.statusText}`,
            data: null,
        };
    } catch (error) {
        console.error('apiRequest - unexpected error:', error);

        return {
            success: false,
            error: 'An unexpected error occurred. Please try again later.',
            data: null,
        };
    }
}

/**
 * Parse response safely
 * @param res - The fetch response object
 * @returns A promise resolving to parsed JSON or null if parsing fails
 */
async function parseResponse<T>(res: Response): Promise<T | null> {
    try {
        return await res.json();
    } catch (error) {
        console.warn('Failed to parse JSON:', error, res);

        return null;
    }
}

export async function fetchData<T>(
    fetchFn: () => Promise<{ success: boolean; data: T | null; error: string | null }>
): Promise<{ loading: boolean; data: T | null; error: string | null }> {
    let loading = true;

    try {
        const response = await fetchFn();

        loading = false;

        if (response.success) {
            return { loading, data: response.data, error: null };
        } else {
            return { loading, data: null, error: response.error || 'Failed to fetch data' };
        }
    } catch (err) {
        console.error('fetchData - error:', err);
        loading = false;

        return { loading, data: null, error: 'An unexpected error occurred. Please try again later.' };
    }
}
