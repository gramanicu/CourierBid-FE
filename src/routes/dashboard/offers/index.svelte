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
        viewedTransport = transports.find(transport => {
            return transport.transportId === id;
        });

        showRoute();
    }

    let trucks = [];
    let contracts = [];
    let transports = [];
    let expeditions = [];
    let cargos = [];
    let models = [];

    let viewedTransport = null;

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
        let res = await callBackend('api/cargo/getall', 'GET');
        res.forEach(cargo => {
            cargos = [...cargos, cargo];
        });

        res = await callBackend('api/truckmodel/getall', 'GET');
        res.forEach(model => {
            models = [...models, model];
        });

        res = await callBackend('api/expeditions/getall', 'GET');
        res.forEach(expedition => {
            expedition.cargo = cargos.find(cargo => {
                return cargo.cargoId === expedition.cargoId;
            });

            expeditions = [...expeditions, expedition];
        });

        res = await callBackend('api/contracts/getall', 'GET');
        res.forEach(contract => {
            contract.expedition = expeditions.find(expedition => {
                return expedition.expeditionId === contract.expeditionId;
            });

            contracts = [...contracts, contract];
        });

        res = await callBackend('api/trucks/getall', 'GET');
        res.forEach(truck => {
            truck.model = models.find(model => {
                return model.modelId === truck.modelId;
            });

            trucks = [...trucks, truck];
        });

        const res1 = await callBackend('api/transports/getall', 'GET');
        res1.forEach(transport => {
            transport.truck = trucks.find(truck => {
                return truck.truckId === transport.truckId;
            });

            const usertype = get(authUser).role;
            if (transport.truck.courierId === get(authUser).id || usertype === roleType.CLIENT) {
                transport.courierId = transport.truck.courierId;
                transport.contracts = contracts.filter(contract => {
                    return contract.transportId === transport.transportId;
                });

                transport.weight = 0;
                transport.volume = 0;

                transport.contracts.forEach(contract => {
                    transport.weight += parseInt(contract.expedition.cargo.weight);
                    transport.volume += parseInt(contract.expedition.cargo.volume);
                });

                transport.startTime = revertTimezone(transport.startTime);
                transport.endTime = revertTimezone(transport.endTime);

                if (
                    (usertype === roleType.CLIENT &&
                        transport.endTime >= new Date() &&
                        transport.startTime >= new Date()) ||
                    usertype === roleType.TRANSPORTER
                ) {
                    transport.startLocation = JSON.parse(transport.startLocation);
                    transport.endLocation = JSON.parse(transport.endLocation);
                    transport.route = JSON.parse(transport.url);
                    transport.weightPercent = (transport.weight * 100) / transport.truck.model.weight;
                    transport.volumePercent = (transport.volume * 100) / transport.truck.model.volume;

                    transport.maxPrice = transport.route.distance * transport.truck.emptyPrice;
                    transport.minPrice = transport.route.distance * transport.truck.fullPrice;

                    if (transport.weightPercent) {
                        transport.earnings =
                            scale(transport.weightPercent, 0, 100, transport.minPrice, transport.maxPrice) *
                            transport.contracts.length;
                    }

                    const progress = scale(
                        Date.parse(new Date()),
                        Date.parse(transport.startTime),
                        Date.parse(transport.endTime),
                        0,
                        100
                    );
                    transport.progress = progress;

                    transports = [...transports, transport];
                }
            }
        });
    }

    onMount(async () => {
        await loadData();
        loadMap();
    });

    function closeModel() {
        viewedTransport = null;
    }

    function progressToString(progresValue) {
        if (progresValue === 0) {
            return 'Not started';
        } else if (progresValue === 100) {
            return 'Finished';
        } else {
            return `${Math.floor(progresValue)}%`;
        }
    }

    function oPercentMustBeNAN(value) {
        if (value === 0 || value === undefined || value === null || value === 'NaN') {
            return 'N/A';
        } else {
            return `${Math.floor(value)}%`;
        }
    }

    function oMustBeNAN(value) {
        if (value === 0 || value === undefined || value === null || value === 'NaN') {
            return 'N/A';
        } else {
            return `${Math.round(value * 100) / 100}`;
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
        window.mapAddPoint(viewObject, viewedTransport.startLocation.coordinates, 'start', () => {
            window.mapAddPoint(viewObject, viewedTransport.endLocation.coordinates, 'end', () => {
                window.computeRoute(viewObject, routeComputedCallback);
            });
        });
    }

    function routeComputedCallback(length) {
        const routeStart = viewedTransport.startLocation.coordinates;
        const routeEnd = viewedTransport.endLocation.coordinates;
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

        if (viewedTransport.progress > 0 && viewedTransport.progress < 100) {
            const currLocation = Math.floor(
                scale(
                    Date.parse(new Date()),
                    Date.parse(viewedTransport.startTime),
                    Date.parse(viewedTransport.endTime),
                    0,
                    viewedTransport.route.route.length
                )
            );

            window.addTruck(viewObject, viewedTransport.route.route[currLocation], 'enroute');
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
    {#if transports}
        <table class="table w-full border border-base-300">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Progress</th>
                    <th class="hidden lg:table-cell">Start City</th>
                    <th class="hidden lg:table-cell">End City</th>
                    <th class="hidden sm:table-cell">Contracts</th>
                    <th class="hidden sm:table-cell"
                        >{get(authUser).role === roleType.CLIENT ? 'Max Price' : 'Earnings'} (RON)</th>
                    <th class="hidden 2xl:table-cell">Cargo Volume (m³)</th>
                    <th class="hidden xl:table-cell">Cargo Weight (kg)</th>
                    <th>View</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {#each transports as transport, index}
                    <tr>
                        <td class="sticky left-0 z-10">{index + 1}</td>
                        <td>{progressToString(transport.progress)}</td>
                        <td class="hidden lg:table-cell">{transport.startLocation.city}</td>
                        <td class="hidden lg:table-cell">{transport.endLocation.city}</td>
                        <td class="hidden sm:table-cell">{transport.contracts.length}</td>
                        <td class="hidden sm:table-cell"
                            >{oMustBeNAN(
                                get(authUser).role === roleType.CLIENT ? transport.maxPrice : transport.earnings
                            )}</td>
                        <td class="hidden 2xl:table-cell"
                            >{transport.volume} ({oPercentMustBeNAN(transport.volumePercent)})</td>
                        <td class="hidden xl:table-cell"
                            >{transport.weight} ({oPercentMustBeNAN(transport.weightPercent)})</td>
                        <td>
                            <ModalToggle on:click={openModal(transport.transportId)} name="view-modal"
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
        {#if viewedTransport}
            <div class="prose mt-4 w-full pr-4">
                <h2 class="my-1">Transport information</h2>
                <div class="flex flex-col justify-between w-full">
                    <p class="my-1">
                        Assigned Contracts: {viewedTransport.contracts.length}<br />
                        {get(authUser).role === roleType.CLIENT ? 'Max Price' : 'Earnings'} (RON): {oMustBeNAN(
                            get(authUser).role === roleType.CLIENT ? viewedTransport.maxPrice : viewedTransport.earnings
                        )}<br />
                        Route progress: {progressToString(viewedTransport.progress)}
                    </p>
                    <p class="my-1">
                        Route: {viewedTransport.startLocation.city} to {viewedTransport.endLocation.city}<br />
                        Departure: {viewedTransport.startTime.toLocaleString('ro-RO')}<br />
                        Arrival: {viewedTransport.endTime.toLocaleString('ro-RO')}
                    </p>
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
