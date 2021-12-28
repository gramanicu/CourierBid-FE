<script>
    export let placeholder;
    export let name;
    export let value = '';
    export let disabled = null;
</script>

<div class="form-control">
    <input
        {disabled}
        bind:value
        type="text"
        {name}
        {placeholder}
        class="{$$props.class} input input-sm input-bordered" />
</div>
