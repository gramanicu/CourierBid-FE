<script context="module">
    import { roleType, roleGuard } from '$lib/utils';

    const permittedRoles = [roleType.TRANSPORTER, roleType.CLIENT];

    export async function load() {
        return roleGuard(permittedRoles);
    }
</script>

<script>
    export const ssr = false;
    import Map from '@arcgis/core/Map';
    import MapView from '@arcgis/core/views/MapView';
    import '@arcgis/core/assets/esri/themes/dark/main.css';

    let centerText;
    const createMap = domNode => {
        // Create the map
        const map = new Map({
            basemap: 'streets',
        });
        // Create the mapView from the map
        const view = new MapView({
            container: domNode,
            map: map,
            zoom: 8,
            center: [-90, 38], // longitude, latitude
        });
        view.watch('center', center => {
            const { latitude, longitude } = center;
            centerText = `Lat: ${latitude.toFixed(2)} | Lon: ${longitude.toFixed(2)}`;
        });
    };
</script>

<div class="view" use:createMap />

{#if centerText}
    <p>{centerText}</p>
{/if}

<style>
    .view {
        height: 400px;
        width: 400px;
    }
</style>
