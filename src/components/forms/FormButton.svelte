<script>
    export let text;
    export let loading = false;
</script>

<button on:click class="{$$props.class} {loading ? 'loading ' : ''} btn btn-primary btn-block text-neutral-content"
    >{text}</button>
