<script context="module">
    import { roleType, roleGuard } from '$lib/utils';
    const permittedRoles = [roleType.CLIENT];

    export async function load() {
        return roleGuard(permittedRoles);
    }
</script>

<script>
    import { callBackend } from '$lib/backend';
    import { onMount } from 'svelte';
    import { authUser } from '$stores/auth';
    import { get } from 'svelte/store';
    import VisibilitySvg from '$components/svg/VisibilitySvg.svelte';
    import { goto } from '$app/navigation';

    let expeditions = [];
    let cargos = [];
    let contracts = [];
    let types = [];

    function scale(number, inMin, inMax, outMin, outMax) {
        let value = ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
        if (value > outMax) {
            return outMax;
        }

        if (value < outMin) {
            return outMin;
        }

        return value;
    }

    Date.prototype.addHours = function (h) {
        this.setTime(this.getTime() + h * 60 * 60 * 1000);
        return this;
    };

    function revertTimezone(dateString) {
        let startDate = new Date(dateString);
        return startDate.addHours(-startDate.getTimezoneOffset() / 60);
    }

    async function loadData() {
        let res = await callBackend('api/cargotypes/getall', 'GET');
        res.forEach(type => {
            types = [...types, type];
        });

        res = await callBackend('api/cargo/getall', 'GET');
        res.forEach(cargo => {
            cargo.type = types.find(type => {
                return type.cargoTypeId === cargo.categoryId;
            });

            cargos = [...cargos, cargo];
        });

        res = await callBackend('api/contracts/getall', 'GET');
        res.forEach(contract => {
            contracts = [...contracts, contract];
        });

        res = await callBackend('api/expeditions/getall', 'GET');
        res.forEach(expedition => {
            const userid = get(authUser).id;
            if (expedition.userId === userid) {
                expedition.cargo = cargos.find(cargo => {
                    return cargo.cargoId === expedition.cargoId;
                });

                expedition.hasContract =
                    contracts.filter(contract => {
                        return contract.expeditionId === expedition.expeditionId;
                    }).length > 0;

                if (!expedition.hasContract) {
                    expedition.pickupTime = revertTimezone(expedition.pickupTime);
                    expedition.deliveryTime = revertTimezone(expedition.deliveryTime);
                    expedition.pickupLimit = revertTimezone(expedition.pickupLimit);
                    expedition.deliveryLimit = revertTimezone(expedition.deliveryLimit);

                    expedition.pickupLocation = JSON.parse(expedition.pickupLocation);
                    expedition.deliveryLocation = JSON.parse(expedition.deliveryLocation);

                    expeditions = [...expeditions, expedition];
                }
            }
        });
    }

    onMount(async () => {
        await loadData();
    });
</script>

<div class="w-full overflow-x-auto min-h-full">
    {#if expeditions}
        <table class="table w-full border border-base-300">
            <thead>
                <tr>
                    <th>#</th>
                    <th>From</th>
                    <th>To</th>
                    <th class="hidden sm:table-cell">Budget (RON)</th>
                    <th class="hidden lg:table-cell">Weight (kg)</th>
                    <th class="hidden lg:table-cell">Type</th>
                    <th>View</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {#each expeditions as expedition, index}
                    <tr>
                        <td class="sticky left-0 z-10">{index + 1}</td>
                        <td>{expedition.pickupLocation.city}</td>
                        <td>{expedition.deliveryLocation.city}</td>
                        <td class="hidden sm:table-cell">{expedition.budget}</td>
                        <td class="hidden lg:table-cell">{expedition.cargo.weight}</td>
                        <td class="hidden lg:table-cell">{expedition.cargo.type.name}</td>
                        <td>
                            <a href="/dashboard/expeditions/{expedition.expeditionId}">
                                <VisibilitySvg class="cursor-pointer" />
                            </a>
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
</div>
