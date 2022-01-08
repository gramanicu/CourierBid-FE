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
        is_valid = true;
    });

    function routeComputedCallback(length) {
        const midPoint = {
            lat: (startPosition.lat + endPosition.lat) / 2,
            lng: (startPosition.lng + endPosition.lng) / 2,
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
        routeLength = length;
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
        console.log(truck);
        console.log(information);
        console.log(startPosition);
        console.log(endPosition);
        document.querySelector('#route-map').innerHTML = '';
        setTimeout(() => {
            window.loadEsriMap('route-map', mapLoadCallback);
        }, 500);
    }
    $: visible && loadMap();
</script>

{#if visible}
    <p>{routeLength} km</p>
{/if}
<div class={!visible ? 'hidden' : 'flex'} id="route-map" />

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
