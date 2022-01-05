<script context="module">
    import { isLogged } from '$stores/auth';
    import { get } from 'svelte/store';
    import { browser } from '$app/env';

    export async function load() {
        if (browser) {
            const isLoggedIn = get(isLogged);

            if (isLoggedIn === 'true') {
                return { status: 302, redirect: '/dashboard' };
            } else return {};
        } else return {};
    }
</script>

<slot />
