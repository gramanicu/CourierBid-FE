<script context="module">
    import { roleType, roleGuard } from '$lib/utils';
    import EditSvg from '$components/svg/EditSvg.svelte';
    import Modal from '$components/modal/Modal.svelte';
    import ModalToggle from '$components/modal/ModalToggle.svelte';

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
                <td on:click={openModal(0)}>
                    <ModalToggle name="edit-modal"><EditSvg class="cursor-pointer" /></ModalToggle>
                </td>
            </tr>
        </tbody>
    </table>

    <Modal name="edit-modal" successBtnName="Save">
        <div>HELLO</div>
    </Modal>
</div>
