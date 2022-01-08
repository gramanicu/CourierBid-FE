<script>
    export let label;
    export let placeholder;
    export let name;
    export let value = '';
    export let currency = '$';

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    function changed() {
        if (value)
            dispatch('input', {
                value,
            });
    }
</script>

<div class="form-control">
    <label for={name} class="label">
        <span class="label-text">{label}</span>
    </label>
    <label class="input-group input-group-md">
        <input
            bind:value
            step="0.01"
            type="number"
            on:input={changed}
            {name}
            {placeholder}
            class="input  input-bordered input-md" />
        <span>{currency}</span>
    </label>
</div>

<style lang="scss">
    .input-group :first-child {
        flex-grow: 1;
    }
</style>
