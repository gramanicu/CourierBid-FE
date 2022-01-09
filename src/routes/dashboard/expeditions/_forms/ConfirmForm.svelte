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
        <div class="prose w-full">
            <div class="flex flex-col justify-between w-full">
                <h2>Cargo</h2>
                <p class="my-1">
                    Cargo Type: {cargo.type.name}<br />
                    Budget: {cargo.budget} RON<br />
                    Volume: {cargo.volume} m³<br />
                    Weight: {cargo.weight} kg<br />
                </p>
                <h2>Route</h2>
                <p class="my-1">
                    {route.startCity} to {route.endCity}<br />
                    Length: {Math.floor(route.length)} km<br />
                </p>
                <h2>Pickup & Delivery Times</h2>
                <p class="my-1">
                    Departure - {info.pickupTime.toLocaleString()}<br />
                    Arrival - {info.deliveryTime.toLocaleString()}<br />
                    Earliest Departure - {info.pickupLimit.toLocaleString()}<br />
                    Latest Arrival - {info.deliveryLimit.toLocaleString()}
                </p>
            </div>
        </div>
    {/if}
{/if}

<style lang="scss">
    .prose {
        h2 {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
        }
    }
</style>
