<script>
    import { onMount } from 'svelte';

    export let visible = false;
    export let is_valid = false;

    // Testing
    let position_end = null;

    let city = '';
    let position = null;
    let viewObject = null;
    let mapObject = null;

    onMount(() => {
        is_valid = false;
    });

    function updateCity(data) {
        if (data.length !== 0) {
            city = data[0].address;
            if (!position) {
                position = {
                    lat: data[0].location.latitude,
                    lng: data[0].location.longitude,
                };
                window.centerMap(viewObject, position);
                window.mapAddPoint(viewObject, position, 'start');
            } else {
                position_end = {
                    lat: data[0].location.latitude,
                    lng: data[0].location.longitude,
                };
                window.centerMap(viewObject, position_end);
                window.mapAddPoint(viewObject, position_end, 'end');
            }

            // window.mapRemovePoints(viewObject);
        } else {
            city = 'No results';
        }
    }

    function mapLoadCallback(map, view) {
        mapObject = map;
        viewObject = view;
    }

    function routeComputedCallback(length) {
        console.log(`Length of route is ${length} km`);
    }

    function loadMap() {
        document.querySelector('#arcgis-map').innerHTML = '';
        setTimeout(() => {
            window.loadEsriMap('arcgis-map', mapLoadCallback);

            window.getCityCoordinates('Braila', updateCity);
            setTimeout(() => {
                window.getCityCoordinates('Bucuresti', updateCity);

                setTimeout(() => {
                    console.log('Computing route');
                    window.computeRoute(viewObject, routeComputedCallback);
                }, 1000);
            }, 1000);
        }, 100);
    }
    $: visible && loadMap();
</script>

{#if visible}
    <p>{city}</p>
    <p>{JSON.stringify(position)}</p>
{/if}
<div class={!visible ? 'hidden' : 'flex'} id="arcgis-map" />

<style lang="scss">
    @import 'https://js.arcgis.com/4.22/@arcgis/core/assets/esri/themes/dark/main.css';

    #arcgis-map {
        padding: 0;
        margin: 0;
        height: 16rem;
        width: 100%;
    }
</style>
