<script context="module">
    import { roleType, roleGuard } from '$lib/utils';

    const permittedRoles = [roleType.TRANSPORTER, roleType.CLIENT];

    export async function load() {
        return roleGuard(permittedRoles);
    }
</script>

<script>
    import { onMount } from 'svelte';
    import { vars } from '$lib/vars';
    onMount(() => {
        sessionStorage.setItem('esriApiKey', vars.esriApiKey);
    });
</script>

<div id="arcgis-map" />

<style lang="scss">
    @import 'https://js.arcgis.com/4.22/@arcgis/core/assets/esri/themes/dark/main.css';

    #arcgis-map {
        padding: 0;
        margin: 0;
        height: 100%;
        width: 100%;
    }
</style>
