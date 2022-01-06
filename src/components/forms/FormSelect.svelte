<script>
    export let placeholder;
    export let name;
    export let options; // An array of the selects options ({value, label})
    export let value;

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    function selected() {
        dispatch('selected', {
            value,
        });
    }
</script>

{#if options && options.length > 0}
    <select bind:value {name} on:change={selected} class="select select-bordered w-full max-w-xs">
        {#if placeholder}
            <option disabled="disabled" value={null} selected="selected">{placeholder}</option>
        {/if}

        {#each options as opt}
            <option value={opt.value}>{opt.label}</option>
        {/each}
    </select>
{:else}
    <select {name} disabled="disabled" class="select select-bordered w-full max-w-xs">
        <option disabled="disabled" selected="selected">No values available</option>
    </select>
{/if}
