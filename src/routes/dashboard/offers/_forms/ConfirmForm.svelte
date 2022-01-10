<script>
    import { onMount } from 'svelte';

    export let visible = false;
    export let is_valid = false;

    export let startPosition;
    export let endPosition;
    export let truck;
    export let information;

    let mapObject = null;
    let viewObject = null;
    let routeLength = 0;

    onMount(() => {
        is_valid = false;
    });

    function routeComputedCallback(length, path) {
        let route = [];
        path.forEach(points => {
            const point = {
                lat: points[1],
                lng: points[0],
            };
            route.push(point);
        });

        const midPoint = {
            lat: (startPosition.lat + endPosition.lat) / 2,
            lng: (startPosition.lng + endPosition.lng) / 2,
        };

        information.url = {};
        information.url.route = route;
        information.url.distance = length;

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
        routeLength = length;
        is_valid = true;
    }

    function mapLoadCallback(map, view) {
        mapObject = map;
        viewObject = view;

        window.mapAddPoint(viewObject, startPosition, 'start', () => {
            window.mapAddPoint(viewObject, endPosition, 'end', () => {
                window.computeRoute(viewObject, routeComputedCallback);
            });
        });
    }

    function loadMap() {
        document.querySelector('#route-map').innerHTML = '';
        setTimeout(() => {
            window.loadEsriMap('route-map', mapLoadCallback);
        }, 500);
    }
    $: visible && loadMap();
</script>

<div class={!visible ? 'hidden' : 'flex'} id="route-map" />

{#if visible}
    <div class="prose mt-4 max-w-xs">
        <h2 class="my-1">Truck</h2>
        <p class="my-1">
            Registry plate - {truck.registryPlate}<br />
            Avg. Speed - {truck.model.speed}
        </p>
        <h2 class="my-1">Route</h2>
        <p class="my-1">
            {startPosition.city} to {endPosition.city}<br />
            Length - {Math.floor(information.length)} km Duration - {information.duration}<br />
            Departure - {information.departure.toLocaleString('ro-RO')}<br />
            Arrival - {information.arrival.toLocaleString('ro-RO')}
        </p>
        <small class="my-1">*these values are approximate</small>
    </div>
{/if}

<style lang="scss">
    #route-map {
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
