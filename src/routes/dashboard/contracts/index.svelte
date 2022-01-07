<script context="module">
    import { roleType, roleGuard } from '$lib/utils';

    const permittedRoles = [roleType.TRANSPORTER, roleType.CLIENT];

    export async function load() {
        return roleGuard(permittedRoles);
    }
</script>

<div id="arcgis-map" />
