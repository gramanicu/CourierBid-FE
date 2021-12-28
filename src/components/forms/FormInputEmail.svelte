<script>
    export let label;
    export let placeholder;
    export let name;
    export let value = '';
    export let error = null;
</script>

<div class="form-control">
    <label for={name} class="label">
        <span class="label-text">{label}</span>
    </label>
    <input
        bind:value
        {name}
        type="email"
        {placeholder}
        class="input {!error ? 'input-primary' : 'input-error'} input-bordered" />
    {#if error}
        <label for={name} class="label">
            <span class="label-text-alt">{error}</span>
        </label>
    {/if}
</div>
