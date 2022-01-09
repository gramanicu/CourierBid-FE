<script>
    import { onMount } from 'svelte';

    export let visible = false;
    export let is_valid = false;

    export let truck;
    export let information;

    onMount(() => {
        // This form is only to confirm
        is_valid = true;
    });
</script>

{#if visible}
    {#if truck && information}
        <div class="prose mt-4 w-full pr-4">
            <div class="flex flex-col justify-between w-full">
                <p class="my-1">
                    Brand: {truck.brand}<br />
                    Model: {truck.name}<br />
                    Registry Plate: {information.license_plate}<br />
                    Full Price: {information.full_price} RON/km<br />
                    Empty Price: {information.empty_price} RON/km
                </p>
                <p class="my-1">
                    Avg. Speed: {truck.speed} kph<br />
                    Dimensions: {truck.dimensions} m<br />
                    Volume: {truck.volume} m³<br />
                    Max. Cargo: {truck.weight} kg
                </p>
            </div>
        </div>
    {/if}
{/if}
