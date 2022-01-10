<script context="module">
    import { roleType, roleGuard } from '$lib/utils';

    const permittedRoles = [roleType.TRANSPORTER, roleType.CLIENT];

    export async function load() {
        return roleGuard(permittedRoles);
    }
</script>

<script>
    import { callBackend } from '$lib/backend';
    import { onMount } from 'svelte';
    import Modal from '$components/modal/Modal.svelte';
    import ModalToggle from '$components/modal/ModalToggle.svelte';
    import { authUser } from '$stores/auth';
    import { get } from 'svelte/store';
    import VisibilitySvg from '$components/svg/VisibilitySvg.svelte';

    function openModal(id) {
        viewedContract = contracts.find(contract => {
            return contract.contractId === id;
        });
        showRoute();
    }

    let contracts = [];
    let transports = [];
    let expeditions = [];
    let trucks = [];
    let cargos = [];
    let allcontracts = [];
    let models = [];
    let users = [];

    let viewedContract = null;

    async function loadData() {
        let res = await callBackend('user/getusers', 'GET');
        res.forEach(user => {
            users = [...users, user];
        });

        res = await callBackend('api/cargo/getall', 'GET');
        res.forEach(cargo => {
            cargos = [...cargos, cargo];
        });

        res = await callBackend('api/truckmodel/getall', 'GET');
        res.forEach(model => {
            models = [...models, model];
        });

        res = await callBackend('api/trucks/getall', 'GET');
        res.forEach(truck => {
            truck.model = models.find(model => {
                return model.modelId === truck.modelId;
            });

            truck.courier = users.find(user => {
                return truck.courierId === user.id;
            });

            trucks = [...trucks, truck];
        });

        res = await callBackend('api/transports/getall', 'GET');
        res.forEach(transport => {
            transport.truck = trucks.find(truck => {
                return truck.truckId === transport.truckId;
            });

            transport.startTime = revertTimezone(transport.startTime);
            transport.endTime = revertTimezone(transport.endTime);
            transport.startLocation = JSON.parse(transport.startLocation);
            transport.endLocation = JSON.parse(transport.endLocation);
            transport.route = JSON.parse(transport.url);

            transports = [...transports, transport];
        });

        res = await callBackend('api/expeditions/getall', 'GET');
        res.forEach(expedition => {
            expedition.cargo = cargos.find(cargo => {
                return cargo.cargoId === expedition.cargoId;
            });

            expedition.user = users.find(user => {
                return expedition.userId === user.id;
            });

            expeditions = [...expeditions, expedition];
        });

        res = await callBackend('api/contracts/getall', 'GET');
        res.forEach(contract => {
            contract.expedition = expeditions.find(expedition => {
                return expedition.expeditionId === contract.expeditionId;
            });
            contract.transport = transports.find(transport => {
                return transport.transportId === contract.transportId;
            });

            allcontracts = [...allcontracts, contract];
        });

        allcontracts.forEach(contract => {
            const role = get(authUser).role;
            const userid = get(authUser).id;

            if (role === roleType.CLIENT) {
                if (contract.expedition.userId === userid) {
                    contracts = [...contracts, processContract(contract)];
                }
            } else if (role === roleType.TRANSPORTER) {
                if (contract.transport.truck.courierId === userid) {
                    contracts = [...contracts, processContract(contract)];
                }
            }
        });
    }

    onMount(async () => {
        await loadData();
        loadMap();
    });

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

    function progressToString(progress) {
        if (progress === 0) {
            return 'Not started';
        } else if (progress === 100) {
            return 'Finished';
        } else {
            return 'En route';
        }
    }

    function processContract(contract) {
        const progress = scale(
            Date.parse(new Date()),
            Date.parse(contract.transport.startTime),
            Date.parse(contract.transport.endTime),
            0,
            100
        );

        contract.transport.contracts = allcontracts.filter(contract => {
            return contract.transportId === contract.transport.transportId;
        });

        contract.transport.weight = 0;
        contract.transport.contracts.forEach(contract => {
            contract.transport.weight += parseInt(contract.expedition.cargo.weight);
        });

        contract.transport.weightPercent = (contract.transport.weight * 100) / contract.transport.truck.model.weight;
        contract.progress = progress;
        contract.status = progressToString(progress);

        contract.maxPrice = contract.transport.route.distance * contract.transport.truck.emptyPrice;
        contract.minPrice = contract.transport.route.distance * contract.transport.truck.fullPrice;

        if (contract.transport.weightPercent) {
            contract.earnings = scale(contract.transport.weightPercent, 0, 100, contract.minPrice, contract.maxPrice);
        }

        return contract;
    }

    function closeModel() {
        viewedContract = null;
    }

    function noUndefined(value) {
        if (value === undefined) {
            return 'N/A';
        }
    }

    let mapObject = null;
    let viewObject = null;

    async function mapLoadCallback(map, view) {
        mapObject = map;
        viewObject = view;
    }

    function showRoute() {
        window.mapRemovePoints(viewObject);
        window.mapAddPoint(viewObject, viewedContract.transport.startLocation.coordinates, 'start', () => {
            window.mapAddPoint(viewObject, viewedContract.transport.endLocation.coordinates, 'end', () => {
                window.computeRoute(viewObject, routeComputedCallback);
            });
        });
    }

    function routeComputedCallback(length) {
        const routeStart = viewedContract.transport.startLocation.coordinates;
        const routeEnd = viewedContract.transport.endLocation.coordinates;
        const midPoint = {
            lat: (routeStart.lat + routeEnd.lat) / 2,
            lng: (routeStart.lng + routeEnd.lng) / 2,
        };

        let zoomLevel = 10;
        if (length > 475) {
            zoomLevel = 4;
        } else if (length > 250) {
            zoomLevel = 5;
        } else if (length > 150) {
            zoomLevel = 6;
        } else if (length > 90) {
            zoomLevel = 7;
        } else if (length > 25) {
            zoomLevel = 8;
        } else if (length > 15) {
            zoomLevel = 9;
        } else {
            zoomLevel = 10;
        }

        window.centerMap(viewObject, midPoint, zoomLevel);

        if (viewedContract.progress > 0 && viewedContract.progress < 100) {
            const currLocation = Math.floor(
                scale(
                    Date.parse(new Date()),
                    Date.parse(viewedContract.transport.startTime),
                    Date.parse(viewedContract.transport.endTime),
                    0,
                    viewedContract.transport.route.route.length
                )
            );

            window.addTruck(viewObject, viewedContract.transport.route.route[currLocation], 'enroute');
        }
    }

    function loadMap() {
        document.querySelector('#route-map').innerHTML = '';
        setTimeout(() => {
            window.loadEsriMap('route-map', mapLoadCallback);
        }, 500);
    }
</script>

<div class="w-full overflow-x-auto min-h-full">
    {#if trucks}
        <table class="table w-full border border-base-300">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Status</th>
                    <th class="hidden lg:table-cell">From</th>
                    <th class="hidden lg:table-cell">To</th>
                    <th class="hidden sm:table-cell"
                        >{get(authUser).role == roleType.TRANSPORTER ? 'Earnings' : 'Price'} (RON)</th>
                    <th class="hidden sm:table-cell">Cargo Weight (kg)</th>
                    <th>View</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {#each contracts as contract, index}
                    <tr>
                        <td class="sticky left-0 z-10">{index + 1}</td>
                        <td>{contract.status}</td>
                        <td class="hidden lg:table-cell">{contract.transport.startLocation.city}</td>
                        <td class="hidden lg:table-cell">{contract.transport.endLocation.city}</td>
                        <td class="hidden sm:table-cell">{Math.floor(contract.earnings)}</td>
                        <td class="hidden sm:table-cell">{contract.expedition.cargo.weight}</td>
                        <td>
                            <ModalToggle on:click={openModal(contract.contractId)} name="view-modal"
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
        {#if viewedContract}
            <div class="prose mt-4 w-full pr-4">
                <h2 class="my-1">Contract information</h2>
                <div class="flex flex-col sm:flex-row justify-between w-full">
                    <div>
                        <h3 class="my-1">Expeditor</h3>
                        <p class="my-1">
                            {viewedContract.expedition.user.firstName}
                            {viewedContract.expedition.user.lastName} <br />
                            Email: {viewedContract.expedition.user.email}<br />
                            Phone: {noUndefined(viewedContract.expedition.user.phone)}<br />
                        </p>
                    </div>
                    <div>
                        <h3 class="my-1">Route</h3>
                        <p class="my-1">
                            {viewedContract.transport.startLocation.city} to {viewedContract.transport.endLocation.city}
                            <br />
                            Progress: {progressToString(viewedContract.progress)} ({Math.floor(
                                viewedContract.transport.route.distance
                            )} km) <br />
                            Departure: {viewedContract.transport.startTime.toLocaleString('ro-RO')}<br />
                            Arrival: {viewedContract.transport.endTime.toLocaleString('ro-RO')}
                        </p>
                    </div>
                </div>
            </div>
        {/if}
        <div id="route-map" />
    </Modal>
</div>

<style lang="scss">
    #route-map {
        overflow: hidden;
        padding: 0;
        margin: 0;
        height: 16rem;
        max-width: 32rem;
        width: 100%;
        border-radius: 0.75rem;
        margin-top: 1rem;
        border-width: 2px;

        --tw-border-opacity: 1;
        border-color: hsla(var(--p) / var(--tw-border-opacity));
        --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    }
</style>
