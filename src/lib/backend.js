import { vars } from '$lib/vars';
import { authUser } from '$stores/auth';
import { get } from 'svelte/store';

/**
 * Calls the backend routes
 * @param {String} route The route name (/x/y/...)
 * @param {String} method The HTTP method
 * @param {JSON} body The HTTP Body (optional)
 * @param {JSON} headers The HTTP Headers (optional)
 * @returns The JSON response from the backend
 */
export async function callBackend(route, method, body, headers) {
    if (body) {
        body = JSON.stringify(body);

        headers = {
            ...headers,
            'Content-Length': body.length,
            'Content-Type': 'application/json',
        };
    }

    if (get(authUser).token != null) {
        headers = {
            ...headers,
            Authorization: `Bearer ${get(authUser).token}`,
        };
    }

    const url = vars.baseApiUrl + route;
    const res = await fetch(url, {
        method,
        headers,
        body,
    });

    if (!res.ok) throw new Error(await res.text());

    const contentType = res.headers.get('content-type');

    if (contentType && contentType.indexOf('application/json') !== -1) {
        return res.json();
    } else {
        return res.text();
    }
}
