<script>
    import { authUser } from '$stores/auth';
    import Admin from './_admin/admin.svelte';
    import Client from './_client/client.svelte';
    import Transporter from './_transporter/transporter.svelte';

    const role = $authUser.role;
</script>

{#if role === 'ADMIN'}
    <Admin />
{:else if role == 'TRANSPORTER'}
    <Transporter />
{:else if role == 'CLIENT'}
    <Client />
{/if}
