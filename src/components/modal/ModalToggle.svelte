<script>
    export let name;

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    function click() {
        dispatch('click');
    }
</script>

<label on:click={click} for={name}><slot /></label>
