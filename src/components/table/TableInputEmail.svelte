<script>
    export let placeholder;
    export let name;
    export let value;
    export let disabled = null;
</script>

<div class="form-control">
    <input
        bind:value
        type="email"
        {disabled}
        {name}
        {placeholder}
        class="{$$props.class} input input-sm input-bordered" />
</div>
