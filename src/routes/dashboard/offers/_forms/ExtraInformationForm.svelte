<script>
    import { onMount } from 'svelte';
    import FormDateHourPicker from '$components/forms/FormDateHourPicker.svelte';

    export let visible = false;
    export let is_valid = false;

    export let startPosition;
    export let endPosition;
    export let truck;
    export let information;

    let routeLength = 0;
    let duration = null;
    let arrivalDateTime = null;

    onMount(() => {
        is_valid = true;
    });

    let startDate = new Date().toISOString().slice(0, 10);
    let startTime = new Date().getHours();

    String.prototype.toHHMMSS = function () {
        var sec_num = parseInt(this, 10); // don't forget the second param
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - hours * 3600) / 60);
        var seconds = sec_num - hours * 3600 - minutes * 60;

        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return hours + ':' + minutes + ':' + seconds;
    };

    function hmsToSecondsOnly(str) {
        var p = str.split(':'),
            s = 0,
            m = 1;

        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }

        return s;
    }

    function routeComputedCallback(length) {
        routeLength = length;
        duration = String((length / truck.model.speed) * 3600).toHHMMSS();
        computeArrival();
    }

    function computeRoute() {
        window.routeLength(startPosition, endPosition, routeComputedCallback);
    }

    function datePickedCallback() {
        computeArrival();
    }

    function hourPickedCallback() {
        computeArrival();
    }

    function computeArrival() {
        arrivalDateTime = new Date(startDate);
        arrivalDateTime = new Date(arrivalDateTime.setHours(startTime));
        let startDateTime = arrivalDateTime;

        arrivalDateTime = new Date(arrivalDateTime.getTime() + 1000 * hmsToSecondsOnly(duration));

        information = {
            departure: startDateTime,
            arrival: arrivalDateTime,
            length: routeLength,
            fullPrice: Math.floor(truck.fullPrice * routeLength),
            emptyPrice: Math.floor(truck.emptyPrice * routeLength),
            duration: duration,
        };
    }

    $: visible && computeRoute();
</script>

{#if visible}
    <div class="w-full shadow stats mb-4">
        <div class="stat place-items-center place-content-center">
            <div class="stat-title">Route Length</div>
            {#if routeLength}
                <div class="stat-value">{Math.floor(routeLength)} KM</div>
            {:else}
                <div class="stat-value">computing...</div>
            {/if}
            <div class="stat-desc text-success">(shortest route)</div>
        </div>
        <div class="stat place-items-center place-content-center">
            <div class="stat-title">Route duration</div>
            {#if duration}
                <div class="stat-value text-success">{duration}</div>
            {:else}
                <div class="stat-value">computing...</div>
            {/if}
            <div class="stat-desc text-success">(avg. speed {truck.model.speed} kph)</div>
        </div>
    </div>
    <FormDateHourPicker
        bind:hour={startTime}
        bind:date={startDate}
        on:hourChange={hourPickedCallback}
        on:dateChange={datePickedCallback}
        name="pickupTime"
        label="Pickup" />
    <div class="mt-4">
        {#if arrivalDateTime}
            <p class="mb-0">
                Expected arrival: {arrivalDateTime.toLocaleDateString('ro-RO')}, {arrivalDateTime.toLocaleTimeString(
                    'ro-RO'
                )}
            </p>
            <p>
                Route cost: {Math.floor(truck.emptyPrice * routeLength)} - {Math.floor(truck.fullPrice * routeLength)} RON
            </p>
        {/if}
    </div>
{/if}

<style lang="scss">
    .stat-value {
        font-size: 1.5rem;
    }

    .stat-desc {
        font-size: 0.75rem;
    }
</style>
