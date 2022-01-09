<script>
    import FormTextAndButton from '$components/forms/FormTextAndButton.svelte';
    import { onMount } from 'svelte';

    export let visible = false;
    export let is_valid = false;

    export let position = null;
    let city = '';
    let viewObject = null;

    onMount(() => {
        is_valid = false;
    });

    function updateCity(data) {
        if (data.length !== 0) {
            city = data[0].address;
            position = {
                lat: data[0].location.latitude,
                lng: data[0].location.longitude,
                city: city,
            };
            window.centerMap(viewObject, position);
            window.mapAddPoint(viewObject, position, 'start');

            is_valid = true;
        } else {
            city = 'No results';
        }
    }

    function validateCity() {
        window.mapRemovePoints(viewObject);
        window.getCityCoordinates(city, updateCity);
    }

    function mapLoadCallback(map, view) {
        viewObject = view;
    }

    function loadMap() {
        document.querySelector('#pickup-map').innerHTML = '';
        // window.computeRoute(viewObject, routeComputedCallback);
        setTimeout(() => {
            window.loadEsriMap('pickup-map', mapLoadCallback);
        }, 500);
    }
    $: visible && loadMap();
</script>

{#if visible}
    <FormTextAndButton
        bind:value={city}
        on:submit={validateCity}
        name="startLocation"
        placeholder="Search for a city"
        label="Pickup City"
        buttonText="Verify" />
{/if}
<div class={!visible ? 'hidden' : 'flex'} id="pickup-map" />

<style lang="scss">
    #pickup-map {
        overflow: hidden;
        padding: 0;
        margin: 0;
        height: 16rem;
        width: 100%;
        border-radius: 0.75rem;
        margin-top: 1rem;
        border-width: 2px;
        --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    }
</style>
