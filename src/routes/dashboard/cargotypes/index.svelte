<script context="module">
    import { roleType, roleGuard } from '$lib/utils';
    const permittedRoles = [roleType.ADMIN];

    export async function load() {
        return roleGuard(permittedRoles);
    }
</script>
