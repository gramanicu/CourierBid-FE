<script>
    import VisibilitySvg from '$components/svg/VisibilitySvg.svelte';

    export let label;
    export let placeholder;
    export let name;
    export let id = 'password';
    export let value = '';
    export let error = null;

    let visible = false;

    function toggleViewPass() {
        visible = !visible;
    }

    const onInput = e => (value = e.target.value);
</script>

<div class="form-control">
    <label for={name} class="label">
        <span class="label-text">{label}</span>
    </label>
    <div class="relative flex">
        <input
            {id}
            type={visible ? 'text' : 'password'}
            {value}
            {name}
            {placeholder}
            on:input={onInput}
            class="input {!error ? 'input-primary' : 'input-error'} input-bordered w-full pr-16 " />

        <button
            class="absolute top-0 right-0 rounded-l-none btn {!error
                ? 'btn-primary'
                : 'btn-error'} text-neutral-content"
            on:click={toggleViewPass}>
            <VisibilitySvg visible={!visible} />
        </button>
    </div>
    {#if error}
        <label for={name} class="label">
            <span class="label-text-alt">{error}</span>
        </label>
    {/if}
</div>

<style>
</style>
