<script>
    import FormButton from '$components/forms/FormButton.svelte';
    import FormTextAndButton from '$components/forms/FormTextAndButton.svelte';

    export let visible = false;
    export let is_valid = false;

    export let route = {};
    let viewObject = null;
    let mapObject = null;
    let pointsSet = false;
    let loadingRoute = false;
    let loadingStart = false;
    let loadingEnd = false;

    function updateStartCity(data) {
        if (data.length !== 0) {
            const position = {
                lat: data[0].location.latitude,
                lng: data[0].location.longitude,
                city: data[0].address,
            };
            clearAndReadd('end');
            window.centerMap(viewObject, position);
            window.mapAddPoint(viewObject, position, 'start');

            route.start = position;
            verifyPoints();
        } else {
            city = 'No results';
        }
        loadingStart = false;
    }

    function updateEndCity(data) {
        if (data.length !== 0) {
            const position = {
                lat: data[0].location.latitude,
                lng: data[0].location.longitude,
                city: data[0].address,
            };
            clearAndReadd('start');
            window.centerMap(viewObject, position);
            window.mapAddPoint(viewObject, position, 'end');

            route.end = position;
            verifyPoints();
        } else {
            city = 'No results';
        }
        loadingEnd = false;
    }

    function clearAndReadd(which) {
        window.mapRemovePoints(viewObject);

        if (which === 'start') {
            if (route.start) {
                window.mapAddPoint(viewObject, route.start, 'start');
            }
        } else {
            if (route.end) {
                window.mapAddPoint(viewObject, route.end, 'end');
            }
        }
    }

    function validateStartCity() {
        loadingStart = true;
        window.getCityCoordinates(route.startCity, updateStartCity);
    }

    function validateEndCity() {
        loadingEnd = true;
        window.getCityCoordinates(route.endCity, updateEndCity);
    }

    function mapLoadCallback(map, view) {
        mapObject = map;
        viewObject = view;
    }

    function verifyPoints() {
        if (route.start && route.end) {
            pointsSet = true;
        }
    }

    function verifyValid() {
        if (pointsSet && route.length) {
            is_valid = true;
            console.log(route);
        }
    }

    function routeComputedCallback(length) {
        const midPoint = {
            lat: (route.start.lat + route.end.lat) / 2,
            lng: (route.start.lng + route.end.lng) / 2,
        };

        let zoomLevel = 10;
        if (length > 475) {
            zoomLevel = 4;
        } else if (length > 250) {
            zoomLevel = 5;
        } else if (length > 150) {
            zoomLevel = 6;
        } else if (length > 90) {
            zoomLevel = 7;
        } else if (length > 25) {
            zoomLevel = 8;
        } else if (length > 15) {
            zoomLevel = 9;
        } else {
            zoomLevel = 10;
        }

        window.centerMap(viewObject, midPoint, zoomLevel);
        route.length = length;
        loadingRoute = false;

        verifyValid();
    }

    function computeRoute() {
        loadingRoute = true;
        window.computeRoute(viewObject, routeComputedCallback);
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
        bind:loading={loadingStart}
        color={0}
        bind:value={route.startCity}
        on:submit={validateStartCity}
        name="startLocation"
        placeholder="Search for the city"
        label="Pickup City"
        buttonText="Verify" />

    <FormTextAndButton
        bind:loading={loadingEnd}
        color={1}
        bind:value={route.endCity}
        on:submit={validateEndCity}
        name="endLocation"
        placeholder="Search for the city"
        label="Delivery City"
        buttonText="Verify" />
{/if}
<div class={!visible ? 'hidden' : 'flex'} id="delivery-map" />

{#if visible}
    {#if pointsSet}
        <FormButton bind:loading={loadingRoute} on:click={computeRoute} class="mt-4" text="Show route" />
    {/if}
{/if}

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

        --tw-border-opacity: 1;
        border-color: hsla(var(--p) / var(--tw-border-opacity));
        --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    }
</style>
