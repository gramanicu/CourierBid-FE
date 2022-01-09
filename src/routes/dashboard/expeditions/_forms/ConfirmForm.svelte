<script>
    import { onMount } from 'svelte';

    export let visible = false;
    export let is_valid = false;

    export let info;
    export let route;
    export let cargo;

    onMount(() => {
        // This form is only to confirm
        is_valid = true;
    });
</script>

{#if visible}
    {#if info && cargo && route}
        <div class="prose mt-4 w-full pr-4">
            <div class="flex flex-col justify-between w-full">
                <p class="my-1">
                    Brand: {info.brand}<br />
                    Model: {info.name}<br />
                    Registry Plate: {info.license_plate}<br />
                    Full Price: {info.full_price} RON/km<br />
                    Empty Price: {info.empty_price} RON/km
                </p>
                <p class="my-1">
                    Avg. Speed: {info.speed} kph<br />
                    Dimensions: {info.dimensions} m<br />
                    Volume: {info.volume} m³<br />
                    Max. Cargo: {info.weight} kg
                </p>
            </div>
        </div>
    {/if}
{/if}
