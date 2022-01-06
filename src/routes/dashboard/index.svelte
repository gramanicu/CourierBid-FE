<script>
    import { authUser } from '$stores/auth';
    import { get } from 'svelte/store';
    import { browser } from '$app/env';

    const role = get(authUser).role;
    if (browser) {
        console.log(role);
    }
</script>
