<script>
    import { roleType } from '$lib/utils';
    import { authUser } from '$stores/auth';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { goto } from '$app/navigation';

    const role = get(authUser).role;

    onMount(() => {
        if (role === roleType.TRANSPORTER) {
            goto('/dashboard/trucks');
        } else if (role === roleType.CLIENT) {
            goto('/dashboard/contracts');
        } else if (role === roleType.ADMIN) {
            goto('/dashboard/users');
        }
    });
</script>
