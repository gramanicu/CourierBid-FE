<script>
    import FormInputNumber from '$components/forms/FormInputNumber.svelte';
    import FormSelect from '$components/forms/FormSelect.svelte';
    import { callBackend } from '$lib/backend';
    import { onMount } from 'svelte';

    let cargoTypes = [];
    let currentType = null;
    let typeId = null;

    export let visible = false;
    export let is_valid = false;
    export let cargo = {};

    onMount(async () => {
        const res = await callBackend('api/cargotypes/getall', 'GET');
        res.forEach(type => {
            type.value = type.cargoTypeId;
            type.label = type.name;
            cargoTypes = [...cargoTypes, type];
        });
    });

    function onTypeSelect() {
        currentType = cargoTypes.find(o => o.cargoTypeId === typeId);
        cargo.cargoTypeId = typeId;
        cargo.type = currentType;
    }

    function checkValid() {
        if (cargo.budget && cargo.weight && cargo.volume) {
            is_valid = true;
        }
    }
</script>

{#if visible}
    <FormSelect
        on:selected={onTypeSelect}
        bind:value={typeId}
        options={cargoTypes}
        name="Cargo Types"
        label="Cargo Type"
        placeholder="Select the type of the cargo" />

    <span class="mb-2 block" />
    {#if typeId && currentType}
        <FormInputNumber
            on:input={checkValid}
            bind:value={cargo.budget}
            name="budget"
            placeholder="Budget"
            label="Expedition budget (RON)" />

        <FormInputNumber
            on:input={checkValid}
            bind:value={cargo.volume}
            name="volume"
            placeholder="Volume"
            label="Volume (m³)" />

        <FormInputNumber
            on:input={checkValid}
            bind:value={cargo.weight}
            name="weight"
            placeholder="Weight"
            label="Weight (kg)" />
    {/if}
{/if}
