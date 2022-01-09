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
    import FormInputText from '$components/forms/FormInputText.svelte';
    import Modal from '$components/modal/Modal.svelte';
    import ModalToggle from '$components/modal/ModalToggle.svelte';

    let truckModels = [];

    let newModel = {};

    async function addModel() {}

    onMount(async () => {
        const res = await callBackend('api/truckmodel/getall', 'GET');
        res.forEach(type => {
            truckModels = [...truckModels, type];
        });
    });

    function closeModel() {
        newModel = {};
    }

    async function saveModel() {
        const res = await callBackend('api/truckmodel/add', 'POST', newModel);
        truckModels = [...truckModels, res];
    }
</script>

<div class="w-full overflow-x-auto min-h-full">
    <ModalToggle on:click={addModel} name="edit-modal"
        ><div class="w-full btn btn-primary">Add new model</div></ModalToggle>

    {#if truckModels}
        <table class="table w-full border border-base-300">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th class="hidden lg:table-cell">Max. Weight (kg)</th>
                    <th class="hidden lg:table-cell">Volume (m³)</th>
                    <th class="hidden sm:table-cell">Avg. Speed (kph)</th>
                    <th class="hidden sm:table-cell">Dimensions (m)</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {#each truckModels as type, index}
                    <tr>
                        <td class="sticky left-0 z-10">{index + 1}</td>
                        <td>{type.brand}</td>
                        <td>{type.name}</td>
                        <td class="hidden lg:table-cell">{type.weight}</td>
                        <td class="hidden lg:table-cell">{type.volume}</td>
                        <td class="hidden sm:table-cell">{type.speed}</td>
                        <td class="hidden sm:table-cell">{type.dimensions}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <div class="prose max-w-none mt-4">
            <h1 class="w-full text-center">Loading data...</h1>
        </div>
    {/if}

    <Modal on:close={closeModel} on:success={saveModel} name="edit-modal" successBtnName="Save">
        <FormInputText bind:value={newModel.brand} name="brand" placeholder="Brand" label="Brand" />
        <FormInputText bind:value={newModel.name} name="model" placeholder="Model" label="Model" />
        <FormInputText bind:value={newModel.weight} name="weight" placeholder="Weight" label="Max. Weight (kg)" />
        <FormInputText bind:value={newModel.volume} name="volume" placeholder="Volume" label="Volume (m³)" />
        <FormInputText bind:value={newModel.speed} name="speed" placeholder="Speed" label="Avg. Speed (kph)" />
        <FormInputText
            bind:value={newModel.dimensions}
            name="dimensions"
            placeholder="ex. 10.0x10.0x10.0"
            label="Dimensions (w x h x l in meters)" />
    </Modal>
</div>
