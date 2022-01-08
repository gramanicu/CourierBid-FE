<script>
    export let label;
    export let placeholder;
    export let name;
    export let value = '';
    export let buttonText;

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
    <label for={name} class="label">
        <span class="label-text">{label}</span>
    </label>
    <div class="relative">
        <input
            autocomplete="off"
            bind:value
            type="text"
            on:input={input}
            on:keyup={keyup}
            {name}
            {placeholder}
            class="w-full pr-16 input input-primary input-bordered" />
        <button on:click={submit} class="absolute top-0  right-0 rounded-l-none btn btn-primary">{buttonText}</button>
    </div>
</div>
