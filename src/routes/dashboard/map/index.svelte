<script context="module">
    import { roleType, roleGuard } from '$lib/utils';
    import { authUser } from '$stores/auth';

    const permittedRoles = [roleType.TRANSPORTER, roleType.CLIENT, roleType.ADMIN];

    export async function load() {
        return roleGuard(permittedRoles);
    }
</script>

<script>
    import { callBackend } from '$lib/backend';
    import { get } from 'svelte/store';
    import { onDestroy, onMount } from 'svelte';

    let mapObject = null;
    let viewObject = null;

    let transports = [];

    let updater = null;

    onMount(() => {
        loadMap();
    });

    function scale(number, inMin, inMax, outMin, outMax) {
        return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }

    Date.prototype.addHours = function (h) {
        this.setTime(this.getTime() + h * 60 * 60 * 1000);
        return this;
    };

    function revertTimezone(dateString) {
        let startDate = new Date(dateString);
        return startDate.addHours(-startDate.getTimezoneOffset() / 60);
    }

    async function loadTrucks() {
        window.mapRemovePoints(viewObject);

        let trucks = [];
        let models = [];

        let res = await callBackend('api/truckmodel/getall', 'GET');
        res.forEach(model => {
            models.push(model);
        });

        res = await callBackend('api/trucks/getall', 'GET');
        res.forEach(truck => {
            const model = models.find(o => o.modelId === truck.modelId);
            truck.model = model;
            trucks.push(truck);
        });

        // TODO - check if it's part of a contract ?

        res = await callBackend('api/transports/getall', 'GET');
        res.forEach(transport => {
            const truck = trucks.find(o => o.truckId === transport.truckId);

            transport.truck = truck;
            transport.startTime = revertTimezone(transport.startTime);
            transport.endTime = revertTimezone(transport.endTime);
            transport.startLocation = JSON.parse(transport.startLocation);
            transport.endLocation = JSON.parse(transport.endLocation);
            transport.route = JSON.parse(transport.url);

            transports.push(transport);
        });

        transports.forEach(transport => {
            const role = get(authUser).role;

            if (role === roleType.ADMIN || role === roleType.CLIENT || transport.truck.courierId === get(authUser).id) {
                const currLocation = Math.floor(
                    scale(
                        Date.parse(new Date()),
                        Date.parse(transport.startTime),
                        Date.parse(transport.endTime),
                        0,
                        transport.route.length
                    )
                );

                const progress = scale(
                    Date.parse(new Date()),
                    Date.parse(transport.startTime),
                    Date.parse(transport.endTime),
                    0,
                    100
                );

                let title = `Truck #${transport.truck.truckId} - ${transport.truck.registryPlate}`;
                let description = `
                <b>Route :</b> ${transport.startLocation.city} to ${transport.endLocation.city}<br>
                <b>Truck Type:</b> ${transport.truck.model.brand} ${transport.truck.model.name}<br>
                <b>Avg. Speed:</b> ${transport.truck.model.speed} kph<br>
                <b>Price:</b> ${transport.truck.emptyPrice} - ${transport.truck.fullPrice} RON/km<br>
                <b>Pickup :</b> ${transport.startTime.toLocaleString()}<br>
                <b>Expected arrival:</b> ${transport.endTime.toLocaleString()}<br>
                <b>Progress:</b> ${Math.floor(progress)} %`;

                if (currLocation > 0 && currLocation < transport.route.length) {
                    window.addTruck(viewObject, transport.route[currLocation], 'full', title, description);
                }
            }
        });
    }

    async function mapLoadCallback(map, view) {
        mapObject = map;
        viewObject = view;

        loadTrucks();
        updater = setInterval(loadTrucks, 60 * 1000);
    }

    onDestroy(() => {
        clearInterval(updater);
    });

    function loadMap() {
        document.querySelector('#interactive-map').innerHTML = '';
        setTimeout(() => {
            window.loadEsriMap('interactive-map', mapLoadCallback);
        }, 500);
    }
</script>

<div id="interactive-map" />

<style lang="scss">
    #interactive-map {
        overflow: hidden;
        padding: 0;
        margin: 0;
        height: 100%;
        width: 100%;
    }
</style>
