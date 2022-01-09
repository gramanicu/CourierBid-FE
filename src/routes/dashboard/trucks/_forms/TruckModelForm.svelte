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
        <div class="prose mt-4 w-full pr-4">
            <div class="flex flex-col justify-between w-full">
                <p class="my-1">
                    Brand: {currentModel.brand}<br />
                    Model: {currentModel.name}<br />
                    Avg. Speed: {currentModel.speed} kph
                </p>
                <p class="my-1">
                    Dimensions: {currentModel.dimensions} m<br />
                    Volume: {currentModel.volume} m³<br />
                    Max. Cargo: {currentModel.weight} kg
                </p>
            </div>
        </div>
    {/if}
{/if}
