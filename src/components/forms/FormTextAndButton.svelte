<script>
    export let label;
    export let placeholder;
    export let name;
    export let value = '';
    export let buttonText;
    export let color = 0;
    export let loading = false;

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    function input() {
        dispatch('input', {
            value,
        });
    }

    function keyup(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            dispatch('submit', {
                value,
            });
        }
    }

    function submit() {
        dispatch('submit', {
            value,
        });
    }
</script>

<div class="form-control">
    {#if label}
        <label for={name} class="label">
            <span class="label-text">{label}</span>
        </label>
    {/if}
    <div class="relative">
        <input
            autocomplete="off"
            bind:value
            type="text"
            on:input={input}
            on:keyup={keyup}
            {name}
            {placeholder}
            class="w-full pr-16 input {color === 0
                ? 'input-primary'
                : color === 1
                ? 'input-secondary'
                : ''} input-bordered" />
        <button
            on:click={submit}
            class="absolute top-0 {loading ? 'loading ' : ''} right-0 rounded-l-none btn {color === 0
                ? 'btn-primary'
                : color === 1
                ? 'btn-secondary'
                : ''}">{buttonText}</button>
    </div>
</div>
