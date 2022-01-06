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
        <div class="prose mt-2">
            <ul class="text-base-content list-unstyled">
                <li>Brand - {truck.brand}</li>
                <li>Model - {truck.name}</li>
                <li>License Plate - {information.license_plate}</li>
                <li>Usable Space - {truck.dimensions} ({truck.volume})</li>
                <li>Maximum Cargo Weight - {truck.weight} KG</li>
                <li>Average Speed - {truck.speed} KPH</li>
                <li>Empty Price - {information.empty_price} RON</li>
                <li>Full Price - {information.full_price} RON</li>
            </ul>
        </div>
    {/if}
{/if}

<style lang="scss">
    .prose ul > li:before {
        content: '';
        position: absolute;
        background-color: #d4d4d8;
        border-radius: 50%;
        width: 0.375 em;
        height: 0.375 em;
        top: 0.6875 em;
        left: 0.25 em;
    }
</style>
