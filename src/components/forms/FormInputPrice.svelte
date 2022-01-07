<script>
    export let label;
    export let placeholder;
    export let name;
    export let value = '';
    export let currency = '$';

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    function changed() {
        error = !isNumeric(value);

        if (value)
            dispatch('input', {
                value,
            });
    }

    let error = null;
    function isNumeric(value) {
        return /^-?\d+$/.test(value);
    }
</script>

<div class="form-control">
    <label for={name} class="label">
        <span class="label-text">{label}</span>
    </label>
    <label class="input-group input-group-md">
        <input
            bind:value
            type="number"
            on:input={changed}
            {name}
            {placeholder}
            class="input {!error ? 'input-primary' : 'input-error'} input-bordered input-md" />
        <span>{currency}</span>
    </label>
    {#if error}
        <label for={name} class="label">
            <span class="label-text-alt">Please enter a number</span>
        </label>
    {/if}
</div>

<style lang="scss">
    .input-group :first-child {
        flex-grow: 1;
    }
</style>
