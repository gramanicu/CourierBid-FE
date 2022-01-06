import { browser } from '$app/env';
import { get } from 'svelte/store';
import { authUser } from '$stores/auth';

export const roleType = {
    TRANSPORTER: 'TRANSPORTER',
    CLIENT: 'CLIENT',
    ADMIN: 'ADMIN',
};

/**
 * Guards pages based on the auth user role
 * @param { Array<roleType> } permittedRoles An array of the roles permitted
 * @returns What should be loaded
 */
export const roleGuard = permittedRoles => {
    if (browser) {
        const role = get(authUser).role;

        if (permittedRoles.indexOf(role) > -1) {
            return {};
        } else {
            return { status: 302, redirect: '/dashboard' };
        }
    }

    return {};
};
