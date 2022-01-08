<script context="module">
    import { roleType, roleGuard } from '$lib/utils';
    import EditSvg from '$components/svg/EditSvg.svelte';

    const permittedRoles = [roleType.TRANSPORTER, roleType.CLIENT];

    export async function load() {
        return roleGuard(permittedRoles);
    }

    function openModal(id) {
        console.log(id);
    }
</script>

<div class="w-full overflow-x-auto min-h-full">
    <table class="table w-full border border-base-300">
        <thead>
            <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th class="hidden lg:table-cell">First Name</th>
                <th class="hidden lg:table-cell">Last Name</th>
                <th>Role</th>
                <th>Edit</th>
                <th />
            </tr>
        </thead>
        <tbody>
            <tr class="">
                <td class="sticky left-0 z-10">0</td>
                <td>data</td>
                <td>data</td>
                <td class="hidden lg:table-cell">data</td>
                <td class="hidden lg:table-cell">data</td>
                <td>data</td>
                <td class="sticky left-0 z-10 cursor-pointer" on:click={openModal(0)}>
                    <label for="edit-modal"><EditSvg /></label>
                </td>
            </tr>
        </tbody>
    </table>

    <input type="checkbox" id="edit-modal" class="modal-toggle" />
    <div class="modal">
        <div class="modal-box">
            <div class="modal-action">
                <label for="edit-modal" class="btn btn-success">Save</label>
                <label for="edit-modal" class="btn">Close</label>
            </div>
        </div>
    </div>
</div>
