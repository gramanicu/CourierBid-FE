<script context="module">
    import { roleType, roleGuard } from '$lib/utils';
    const permittedRoles = [roleType.ADMIN];

    export async function load() {
        return roleGuard(permittedRoles);
    }
</script>

<script>
    import { callBackend } from '$lib/backend';
    import { onMount } from 'svelte';
    import Modal from '$components/modal/Modal.svelte';
    import ModalToggle from '$components/modal/ModalToggle.svelte';
    import VisibilitySvg from '$components/svg/VisibilitySvg.svelte';

    function openModal(id) {
        editedUser = users.find(user => {
            return user.id === id;
        });
    }

    let users = [];

    let editedUser = null;

    onMount(async () => {
        const res = await callBackend('user/getusers', 'GET');
        res.forEach(user => {
            users = [...users, user];
        });
    });

    function closeModel() {
        editedUser = null;
    }
</script>

<div class="w-full overflow-x-auto min-h-full">
    {#if users}
        <table class="table w-full border border-base-300">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th class="hidden lg:table-cell">First Name</th>
                    <th class="hidden lg:table-cell">Last Name</th>
                    <th class="hidden sm:table-cell">Email</th>
                    <th class="hidden sm:table-cell">Role</th>
                    <th class="hidden 2xl:table-cell">Phone</th>
                    <th>Edit</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {#each users as user, index}
                    <tr>
                        <td class="sticky left-0 z-10">{index + 1}</td>
                        <td>{user.userName}</td>
                        <td class="hidden lg:table-cell">{user.firstName}</td>
                        <td class="hidden lg:table-cell">{user.lastName}</td>
                        <td class="hidden sm:table-cell">{user.email}</td>
                        <td class="hidden sm:table-cell">{user.role.toUpperCase()}</td>
                        <td class="hidden 2xl:table-cell">{user.phone ? editedUser.phone : 'N/A'}</td>
                        <td>
                            <ModalToggle on:click={openModal(user.id)} name="view-modal"
                                ><VisibilitySvg class="cursor-pointer" /></ModalToggle>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <div class="prose max-w-none mt-4">
            <h1 class="w-full text-center">Loading data...</h1>
        </div>
    {/if}

    <Modal on:close={closeModel} name="view-modal" twoButtons={false}>
        {#if editedUser}
            <div class="prose mt-4 w-full pr-4">
                <h2 class="my-1">User information</h2>
                <div class="flex flex-col md:flex-row justify-between w-full">
                    <p class="my-1">
                        Username: {editedUser.userName}<br />
                        First Name: {editedUser.firstName}<br />
                        Last Name: {editedUser.lastName}
                    </p>
                    <p class="my-1">
                        Email: {editedUser.email}<br />
                        Phone: {editedUser.phone ? editedUser.phone : 'N/A'}<br />
                        Role: {editedUser.role.toUpperCase()}
                    </p>
                </div>
            </div>
        {/if}
    </Modal>
</div>
