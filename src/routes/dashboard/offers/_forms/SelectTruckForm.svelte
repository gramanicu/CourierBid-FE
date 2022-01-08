<script>
    import FormSelect from '$components/forms/FormSelect.svelte';
    import { callBackend } from '$lib/backend';
    import { authUser } from '$stores/auth';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';

    let trucks = [];
    export let currentTruck = null;
    let truckId;

    export let visible = false;
    export let is_valid = false;

    onMount(async () => {
        const res = await callBackend('api/trucks/getall', 'GET');
        res.forEach(truck => {
            // TODO - check against the current courier
            if (truck.courierId === get(authUser).id) {
                truck.label = `${truck.registryPlate}`;
                truck.value = truck.truckId;
                trucks = [...trucks, truck];
            }
        });
    });

    function onModelSelect() {
        is_valid = true;
        currentTruck = trucks.find(o => o.truckId === truckId);
    }

    async function modelData() {
        const res = await callBackend(`api/truckmodel/gettruckid/${currentTruck.modelId}`, 'GET');
        currentTruck.model = res;
        return res;
    }
</script>

{#if visible}
    <FormSelect
        on:selected={onModelSelect}
        bind:value={truckId}
        options={trucks}
        name="Trucks"
        placeholder="Select by license plate" />

    {#if truckId && currentTruck}
        <div class="prose mt-2">
            <ul class="text-base-content list-unstyled">
                {#await modelData() then model}
                    <li>Brand - {model.brand}</li>
                    <li>Model - {model.name}</li>
                    <li>Usable Space - {model.dimensions} ({model.volume})</li>
                    <li>Maximum Cargo Weight - {model.weight} KG</li>
                    <li>Average Speed - {model.speed} KPH</li>
                    <li>Empty Price - {currentTruck.emptyPrice} RON</li>
                    <li>Full Price - {currentTruck.fullPrice} RON</li>
                {/await}
            </ul>
        </div>
    {/if}
{/if}

<style lang="scss">
    .prose ul > li:before {
        content: '';
        position: absolute;
        background-color: #d4d4d8;
        border-radius: 50%;
        width: 0.375 em;
        height: 0.375 em;
        top: 0.6875 em;
        left: 0.25 em;
    }
</style>
