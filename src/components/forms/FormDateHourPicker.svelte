<script>
    export let label;
    export let name;
    export let hour = 12;
    export let date = new Date().toISOString().slice(0, 10);

    import { createEventDispatcher, onMount } from 'svelte';

    const dispatch = createEventDispatcher();
    function hourChange() {
        dispatch('hourChange', {
            hour,
        });
    }

    function dateChange() {
        dispatch('dateChange', {
            date,
        });
    }

    onMount(() => {
        date = new Date().toISOString().slice(0, 10);
    });
</script>

<div class="form-control">
    <label for="{name}-date" class="label">
        <span class="label-text">{label} date</span>
    </label>
    <input name="{name}-date" type="date" bind:value={date} on:input={dateChange} class="input input-primary" />
</div>
<div class="form-control mb-2">
    <label for="{name}-hour" class="label">
        <span class="label-text">{label} hour - {hour} {hour >= 12 ? 'PM' : 'AM'}</span>
    </label>
    <div class="relative">
        <input name="{name}-hour" type="range" max="23" bind:value={hour} on:input={hourChange} class="range" />
    </div>
</div>
