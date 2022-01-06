<script context="module">
    import { roleType, roleGuard } from '$lib/utils';
    const permittedRoles = [roleType.TRANSPORTER];

    export async function load() {
        return roleGuard(permittedRoles);
    }
</script>

<script>
    import { callBackend } from '$lib/backend';
    import { onMount } from 'svelte';

    let trucks = [];

    onMount(async () => {
        const res = await callBackend('api/trucks/getall', 'GET');
        res.forEach(truck => {
            trucks = [...trucks, truck];
        });
    });
</script>

<div class="flex flex-col justify-center mt-4">
    <div class="card shadow-lg border border-bg-base-300 card-bordered max-w-3xl">
        <div class="card-body">
            {#each trucks as truck}
                <div class="break-word flex max-w-full">{JSON.stringify(truck)}</div>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    .break-word {
        word-break: break-word;
    }
</style>
