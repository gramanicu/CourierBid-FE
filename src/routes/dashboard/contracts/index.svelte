<script context="module">
    import { roleType, roleGuard } from '$lib/utils';
    import { vars } from '$lib/vars';

    const permittedRoles = [roleType.TRANSPORTER, roleType.CLIENT];

    export async function load() {
        return roleGuard(permittedRoles);
    }
</script>

<script>
    import { onMount } from 'svelte';

    onMount(() => {
        require(['esri/config', 'esri/Map', 'esri/views/MapView'], function (esriConfig, Map, MapView) {
            esriConfig.apiKey = vars.esriApiKey;

            const map = new Map({
                basemap: 'arcgis-topographic', // Basemap layer service
            });

            const view = new MapView({
                map: map,
                center: [-118.805, 34.027], // Longitude, latitude
                zoom: 13, // Zoom level
                container: 'viewDiv', // Div element
            });
        });
    });
</script>

<svelte:head>
    <script src="https://js.arcgis.com/4.22/"></script>
</svelte:head>

<div id="viewDiv" />

<link rel="stylesheet" href="https://js.arcgis.com/4.22/esri/themes/light/main.css" />

<style>
    #viewDiv {
        height: 400px;
        width: 400px;
    }
</style>
