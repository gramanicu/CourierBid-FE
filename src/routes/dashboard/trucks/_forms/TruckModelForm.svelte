<script>
    import FormSelect from '$components/forms/FormSelect.svelte';
    import { callBackend } from '$lib/backend';
    import { onMount } from 'svelte';

    let models = [];
    let trucks = [];
    let modelId = null;
    export let currentModel = null;

    export let visible = false;
    export let is_valid = false;

    onMount(async () => {
        const res = await callBackend('api/truckmodel/getall', 'GET');
        res.forEach(truck => {
            trucks = [...trucks, truck];

            models = [
                ...models,
                {
                    label: `${truck.brand} ${truck.name}`,
                    value: truck.modelId,
                },
            ];
        });
    });

    function onModelSelect() {
        is_valid = true;
        currentModel = trucks.find(o => o.modelId === modelId);
    }
</script>

{#if visible}
    <FormSelect
        on:selected={onModelSelect}
        bind:value={modelId}
        options={models}
        name="Truck Models"
        placeholder="Select the model of the truck" />

    {#if modelId && currentModel}
        <div class="prose mt-2">
            <ul class="text-base-content list-unstyled">
                <li>Brand - {currentModel.brand}</li>
                <li>Model - {currentModel.name}</li>
                <li>Usable Space - {currentModel.dimensions} ({currentModel.volume})</li>
                <li>Maximum Cargo Weight - {currentModel.weight}KG</li>
                <li>Average Speed - {currentModel.speed}KPH</li>
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
