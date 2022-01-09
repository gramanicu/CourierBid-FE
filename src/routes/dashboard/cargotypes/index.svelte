<script context="module">
    import { roleType, roleGuard } from '$lib/utils';
    const permittedRoles = [roleType.ADMIN];

    export async function load() {
        return roleGuard(permittedRoles);
    }
</script>

<script>
    import FormTextAndButton from '$components/forms/FormTextAndButton.svelte';
    import { callBackend } from '$lib/backend';
    import { onMount } from 'svelte';

    let cargoTypes = [];

    let newType;

    async function addType() {
        if (newType !== '') {
            await callBackend('api/cargotypes/add', 'POST', {
                name: newType,
            });
            newType = '';

            cargoTypes = [];
            const res = await callBackend('api/cargotypes/getall', 'GET');
            res.forEach(type => {
                cargoTypes = [...cargoTypes, type];
            });
        }
    }

    onMount(async () => {
        const res = await callBackend('api/cargotypes/getall', 'GET');
        res.forEach(type => {
            cargoTypes = [...cargoTypes, type];
        });
    });
</script>

<div class="w-full overflow-x-auto min-h-full">
    <FormTextAndButton
        bind:value={newType}
        on:submit={addType}
        name="cargoType"
        placeholder="Cargo Type"
        buttonText="Add" />
    {#if cargoTypes}
        <table class="table w-full border border-base-300">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {#each cargoTypes as type, index}
                    <tr>
                        <td class="sticky left-0 z-10">{index + 1}</td>
                        <td>{type.name}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <div class="prose max-w-none mt-4">
            <h1 class="w-full text-center">Loading data...</h1>
        </div>
    {/if}
</div>
