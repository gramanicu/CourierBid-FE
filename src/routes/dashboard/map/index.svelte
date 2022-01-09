<script context="module">
    import { roleType, roleGuard } from '$lib/utils';
    import { authUser } from '$stores/auth';
    import ClientView from './_mapViews/ClientView.svelte';
    import TransporterView from './_mapViews/TransporterView.svelte';

    const permittedRoles = [roleType.TRANSPORTER, roleType.CLIENT];

    export async function load() {
        return roleGuard(permittedRoles);
    }
</script>

{#if $authUser.role === roleType.TRANSPORTER}
    <TransporterView />
{:else if $authUser.role === roleType.CLIENT}
    <ClientView />
{/if}
