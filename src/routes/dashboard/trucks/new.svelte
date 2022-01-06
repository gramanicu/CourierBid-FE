<script context="module">
    import { roleType, roleGuard } from '$lib/utils';
    const permittedRoles = [roleType.TRANSPORTER];

    export async function load() {
        return roleGuard(permittedRoles);
    }
</script>
