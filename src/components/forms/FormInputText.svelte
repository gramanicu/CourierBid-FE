<script>
    export let label;
    export let placeholder;
    export let name;
    export let value = '';
    export let error = null;

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    function input() {
        dispatch('input', {
            value,
        });
    }
</script>

<div class="form-control">
    <label for={name} class="label">
        <span class="label-text">{label}</span>
    </label>
    <input
        bind:value
        type="text"
        on:input={input}
        {name}
        {placeholder}
        class="{$$props.class} input  {!error ? 'input-primary' : 'input-error'} input-bordered" />
    {#if error}
        <label for={name} class="label">
            <span class="label-text-alt">{error}</span>
        </label>
    {/if}
</div>
