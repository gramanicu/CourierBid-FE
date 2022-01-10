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
    import Modal from '$components/modal/Modal.svelte';
    import ModalToggle from '$components/modal/ModalToggle.svelte';
    import VisibilitySvg from '$components/svg/VisibilitySvg.svelte';
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import { goto } from '$app/navigation';

    function openModal(id) {
        viewedTransport = validTransports.find(transport => {
            return transport.transportId === id;
        });
        showRoute();
    }

    let transports = [];
    let contracts = [];
    let trucks = [];
    let models = [];
    let expeditions = [];
    let cargos = [];
    let validTransports = [];

    let loading;
    const expeditionId = get(page).params.id;
    let currentExpedition = null;
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
        let res = await callBackend('api/truckmodel/getall', 'GET');
        res.forEach(model => {
            models = [...models, model];
        });

        res = await callBackend('api/trucks/getall', 'GET');
        res.forEach(truck => {
            truck.model = models.find(model => {
                return model.modelId === truck.modelId;
            });

            trucks = [...trucks, truck];
        });

        res = await callBackend('api/cargo/getall', 'GET');
        res.forEach(cargo => {
            cargos = [...cargos, cargo];
        });

        res = await callBackend('api/transports/getall', 'GET');
        res.forEach(transport => {
            transport.truck = trucks.find(truck => {
                return truck.truckId === transport.truckId;
            });

            transports = [...transports, transport];
        });

        res = await callBackend('api/expeditions/getall', 'GET');
        res.forEach(expedition => {
            expedition.cargo = cargos.find(cargo => {
                return cargo.cargoId === expedition.cargoId;
            });

            expedition.pickupTime = revertTimezone(expedition.pickupTime);
            expedition.pickupLimit = revertTimezone(expedition.pickupLimit);
            expedition.deliveryLimit = revertTimezone(expedition.deliveryLimit);
            expedition.deliveryTime = revertTimezone(expedition.deliveryTime);
            expedition.pickupLocation = JSON.parse(expedition.pickupLocation);
            expedition.deliveryLocation = JSON.parse(expedition.deliveryLocation);

            if (expedition.expeditionId == expeditionId) {
                currentExpedition = expedition;
            }

            expeditions = [...expeditions, expedition];
        });

        if (!currentExpedition) {
            transports = [];
            return;
        }

        res = await callBackend('api/contracts/getall', 'GET');
        res.forEach(contract => {
            contract.expedition = expeditions.find(expedition => {
                return expedition.expeditionId === contract.expeditionId;
            });
            contract.transport = transports.find(transport => {
                return transport.transportId === contract.transportId;
            });

            contracts = [...contracts, contract];
        });

        const hasContract =
            contracts.filter(contract => {
                return contract.expeditionId === currentExpedition.expeditionId;
            }).length > 0;

        if (hasContract) {
            transports = [];
            return;
        }

        transports.forEach(transport => {
            transport.startTime = revertTimezone(transport.startTime);
            transport.endTime = revertTimezone(transport.endTime);
            transport.startLocation = JSON.parse(transport.startLocation);
            transport.endLocation = JSON.parse(transport.endLocation);
            transport.url = JSON.parse(transport.url);

            transport.contracts = contracts.filter(contract => {
                return contract.transportId === transport.transportId;
            });

            transport.weight = 0;
            transport.volume = 0;
            transport.contracts.forEach(contract => {
                transport.weight += parseInt(contract.expedition.cargo.weight);
                transport.volume += parseInt(contract.expedition.cargo.volume);
            });

            // Check transport is valid for this request

            if (
                transport.startLocation.city === currentExpedition.pickupLocation.city &&
                transport.endLocation.city === currentExpedition.deliveryLocation.city
            ) {
                if (
                    transport.startTime >= currentExpedition.pickupLimit &&
                    transport.startTime <= currentExpedition.pickupTime &&
                    transport.endTime >= currentExpedition.deliveryTime &&
                    transport.endTime <= currentExpedition.deliveryLimit
                ) {
                    transport.maxPrice = transport.truck.emptyPrice * transport.url.distance;
                    transport.minPrice = transport.truck.fullPrice * transport.url.distance;
                    transport.fillPercent = (transport.weight * 100) / transport.truck.model.weight;
                    const possibleWeight = transport.weight + parseInt(currentExpedition.cargo.weight);
                    const possibleVolume = transport.volume + parseInt(currentExpedition.cargo.volume);

                    if (
                        possibleWeight <= transport.truck.model.weight &&
                        possibleVolume <= transport.truck.model.volume &&
                        currentExpedition.budget >= transport.maxPrice
                    ) {
                        const possibleWeightPercent = (possibleWeight * 100) / transport.truck.model.weight;

                        transport.possiblePrice = scale(
                            possibleWeightPercent,
                            0,
                            100,
                            transport.minPrice,
                            transport.maxPrice
                        );
                        validTransports = [...validTransports, transport];
                    }
                }
            }
        });
    }

    onMount(async () => {
        loading = true;
        await loadData();
        loadMap();
        loading = false;
    });

    function closeModel() {
        viewedTransport = null;
    }

    function percentToString(percentage) {
        if (percentage === undefined || percentage === null || percentage === 'NaN') {
            return 'N/A';
        } else {
            return `${Math.floor(percentage)}%`;
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
    }

    function loadMap() {
        document.querySelector('#route-map').innerHTML = '';
        setTimeout(() => {
            window.loadEsriMap('route-map', mapLoadCallback);
        }, 500);
    }

    async function createContract() {
        try {
            await callBackend('api/contracts/add', 'POST', {
                transportId: viewedTransport.transportId,
                expeditionId: currentExpedition.expeditionId,
            });

            goto('dashboard/contracts');
        } catch (err) {
            console.error(err);
        }
    }
</script>

<div class="w-full overflow-x-auto min-h-full">
    {#if !loading}
        {#if validTransports}
            <table class="table w-full border border-base-300">
                <thead>
                    <tr>
                        <th>#</th>
                        <th class="hidden lg:table-cell">Pickup</th>
                        <th class="hidden lg:table-cell">Delivery</th>
                        <th class="hidden sm:table-cell">Max Price (RON)</th>
                        <th class="hidden sm:table-cell">Current Price (RON)</th>
                        <th>View</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {#each validTransports as transport, index}
                        <tr>
                            <td class="sticky left-0 z-10">{index + 1}</td>
                            <td class="hidden lg:table-cell">{transport.startTime.toLocaleString('ro-RO')}</td>
                            <td class="hidden lg:table-cell">{transport.endTime.toLocaleString('ro-RO')}</td>
                            <td class="hidden sm:table-cell">{oMustBeNAN(transport.maxPrice)}</td>
                            <td class="hidden sm:table-cell">{oMustBeNAN(transport.possiblePrice)}</td>
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
                <h1 class="w-full text-center">No transport matches this expedition</h1>
            </div>
        {/if}
    {:else}
        <div class="prose max-w-none mt-4">
            <h1 class="w-full text-center">Loading data...</h1>
        </div>
    {/if}

    <Modal on:close={closeModel} on:success={createContract} name="view-modal" successBtnName="Create Contract">
        {#if viewedTransport}
            <div class="prose mt-4 w-full pr-4">
                <h2 class="my-1">Transport information</h2>
                <div class="flex flex-col justify-between w-full">
                    <p class="my-1">
                        Route: {viewedTransport.startLocation.city} to {viewedTransport.endLocation.city}<br />
                        Departure: {viewedTransport.startTime.toLocaleString('ro-RO')}<br />
                        Arrival: {viewedTransport.endTime.toLocaleString('ro-RO')}
                    </p>
                    <p class="my-1">
                        Max Price (RON): {oMustBeNAN(viewedTransport.maxPrice)}<br />
                        Current Price (RON): {oMustBeNAN(viewedTransport.possiblePrice)}<br />
                        Fill percentage: {percentToString(viewedTransport.fillPercent)}
                    </p>
                    <p class="mt-2 mb-1">
                        Expedition budget (RON): {oMustBeNAN(currentExpedition.budget)}
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
