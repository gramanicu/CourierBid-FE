<script context="module">
    import { roleType, roleGuard } from '$lib/utils';
    const permittedRoles = [roleType.CLIENT];

    export async function load() {
        return roleGuard(permittedRoles);
    }
</script>
