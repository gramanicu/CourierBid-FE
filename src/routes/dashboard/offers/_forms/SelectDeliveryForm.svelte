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
            };
            window.centerMap(viewObject, position);
            window.mapAddPoint(viewObject, position, 'end');

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
        document.querySelector('#delivery-map').innerHTML = '';
        // window.computeRoute(viewObject, routeComputedCallback);
        setTimeout(() => {
            window.loadEsriMap('delivery-map', mapLoadCallback);
        }, 500);
    }
    $: visible && loadMap();
</script>

{#if visible}
    <FormTextAndButton
        bind:value={city}
        on:submit={validateCity}
        name="endLocation"
        placeholder="Search for a city"
        label="Delivery City"
        buttonText="Verifiy" />
{/if}
<div class={!visible ? 'hidden' : 'flex'} id="delivery-map" />

<style lang="scss">
    #delivery-map {
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
