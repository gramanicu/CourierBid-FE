<script>
    import { onMount } from 'svelte';

    export let visible = false;
    export let is_valid = false;

    let city = '';
    let position = null;
    let mapObject = null;

    onMount(() => {
        is_valid = false;
    });

    function updateCity(data) {
        city = data[0].address;
        position = {
            lat: data[0].location.latitude,
            lng: data[0].location.longitude,
        };
    }

    function mapLoadCallback(map) {
        mapObject = map;
    }

    function loadMap() {
        document.querySelector('#arcgis-map').innerHTML = '';
        setTimeout(() => {
            window.getCityCoordinates('Braila', updateCity);

            window.loadEsriMap('arcgis-map', mapLoadCallback);
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
