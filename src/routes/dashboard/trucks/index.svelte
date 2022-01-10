<script context="module">
    import { roleType, roleGuard } from '$lib/utils';
    const permittedRoles = [roleType.TRANSPORTER];

    export async function load() {
        return roleGuard(permittedRoles);
    }
</script>

<script>
    import { callBackend } from '$lib/backend';
    import { onMount } from 'svelte';
    import EditSvg from '$components/svg/EditSvg.svelte';
    import Modal from '$components/modal/Modal.svelte';
    import ModalToggle from '$components/modal/ModalToggle.svelte';
    import { authUser } from '$stores/auth';
    import { get } from 'svelte/store';
    import FormInputPrice from '$components/forms/FormInputPrice.svelte';
    import FormInputText from '$components/forms/FormInputText.svelte';

    function openModal(id) {
        editedTruck = trucks.find(truck => {
            return truck.truckId === id;
        });
    }

    let trucks = [];
    let models = [];

    let editedTruck = null;

    onMount(async () => {
        const res = await callBackend('api/truckmodel/getall', 'GET');
        res.forEach(model => {
            models = [...models, model];
        });

        const res1 = await callBackend('api/trucks/getall', 'GET');
        res1.forEach(truck => {
            if (truck.courierId === get(authUser).id) {
                truck.model = models.find(model => {
                    return model.modelId === truck.modelId;
                });

                trucks = [...trucks, truck];
            }
        });
    });

    async function saveModal() {
        const updatedTruck = Object.assign({}, editedTruck);
        delete updatedTruck.model;
        try {
            await callBackend('api/trucks/update', 'POST', updatedTruck);

            Object.assign(trucks[trucks.findIndex(el => el.truckId === editedTruck.truckId)], editedTruck);
        } catch (err) {
            console.error(err);
        }

        trucks = trucks;
        editedTruck = null;
    }

    function closeModel() {
        editedTruck = null;
    }
</script>

<div class="w-full overflow-x-auto min-h-full">
    {#if trucks}
        <table class="table w-full border border-base-300">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Registry Plate</th>
                    <th class="hidden lg:table-cell">Brand</th>
                    <th class="hidden lg:table-cell">Model</th>
                    <th class="hidden sm:table-cell">Avg. Speed (kph)</th>
                    <th class="hidden sm:table-cell">Full Price (RON/km)</th>
                    <th class="hidden 2xl:table-cell">Empty Price (RON/km)</th>
                    <th class="hidden xl:table-cell">Weight Capacity (kg)</th>
                    <th>Edit</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {#each trucks as truck, index}
                    <tr>
                        <td class="sticky left-0 z-10">{index + 1}</td>
                        <td>{truck.registryPlate}</td>
                        <td class="hidden lg:table-cell">{truck.model.brand}</td>
                        <td class="hidden lg:table-cell">{truck.model.name}</td>
                        <td class="hidden sm:table-cell">{truck.model.speed}</td>
                        <td class="hidden sm:table-cell">{truck.fullPrice}</td>
                        <td class="hidden 2xl:table-cell">{truck.emptyPrice}</td>
                        <td class="hidden xl:table-cell">{truck.model.weight}</td>
                        <td>
                            <ModalToggle on:click={openModal(truck.truckId)} name="edit-modal"
                                ><EditSvg class="cursor-pointer" /></ModalToggle>
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

    <Modal on:close={closeModel} on:success={saveModal} name="edit-modal" successBtnName="Save">
        {#if editedTruck}
            <div class="prose mt-4 w-full pr-4">
                <h2 class="my-1">Truck information</h2>
                <div class="flex flex-col md:flex-row justify-between w-full">
                    <p class="my-1">
                        Brand: {editedTruck.model.brand}<br />
                        Model: {editedTruck.model.name}<br />
                        Avg. Speed: {editedTruck.model.speed} kph
                    </p>
                    <p class="my-1">
                        Dimensions: {editedTruck.model.dimensions} m<br />
                        Volume: {editedTruck.model.volume} m³<br />
                        Max. Cargo: {editedTruck.model.weight} kg
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 w-full gap-0 md:gap-4 mt-2">
                <FormInputPrice
                    bind:value={editedTruck.emptyPrice}
                    currency="RON"
                    name="empty_price"
                    placeholder="Empty Price"
                    label="Empty Price (per km)" />
                <FormInputPrice
                    bind:value={editedTruck.fullPrice}
                    currency="RON"
                    name="full_price"
                    placeholder="Full Price (per km)"
                    label="Full Price" />
            </div>
            <FormInputText
                bind:value={editedTruck.registryPlate}
                name="license_plate"
                placeholder="License Plate"
                label="License Plate" />
        {/if}
    </Modal>
</div>
