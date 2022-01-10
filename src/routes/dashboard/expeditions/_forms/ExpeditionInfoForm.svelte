<script>
    import FormDateHourPicker from '$components/forms/FormDateHourPicker.svelte';

    import { onMount } from 'svelte';

    export let visible = false;
    export let is_valid = false;

    export let info = {};

    onMount(() => {
        is_valid = true;
        computeDateTime();
    });

    let startDate = new Date().toISOString().slice(0, 10);
    let startTime = new Date().getHours();
    let endDate = new Date().toISOString().slice(0, 10);
    let endtTime = new Date().getHours();
    let earlyDate = new Date().toISOString().slice(0, 10);
    let earlyTime = new Date().getHours();
    let lateDate = new Date().toISOString().slice(0, 10);
    let lateTime = new Date().getHours();

    function datePickedCallback() {
        computeDateTime();
    }

    function hourPickedCallback() {
        computeDateTime();
    }

    function computeDateTime() {
        if (startDate && startTime) {
            info.pickupTime = new Date(startDate);
            info.pickupTime = new Date(info.pickupTime.setHours(startTime));
        }

        if (earlyDate && earlyTime) {
            info.pickupLimit = new Date(earlyDate);
            info.pickupLimit = new Date(info.pickupLimit.setHours(earlyTime));
        }

        if (endDate && endtTime) {
            info.deliveryTime = new Date(endDate);
            info.deliveryTime = new Date(info.deliveryTime.setHours(endtTime));
        }

        if (lateDate && lateTime) {
            info.deliveryLimit = new Date(lateDate);
            info.deliveryLimit = new Date(info.deliveryLimit.setHours(lateTime));
        }

        if (
            info.pickupLimit <= info.pickupTime &&
            info.pickupTime <= info.deliveryTime &&
            info.deliveryTime <= info.deliveryLimit &&
            new Date() < info.pickupLimit
        ) {
            is_valid = true;
        } else {
            is_valid = false;
        }
    }
</script>

{#if visible}
    <FormDateHourPicker
        bind:hour={earlyTime}
        bind:date={earlyDate}
        on:hourChange={hourPickedCallback}
        on:dateChange={datePickedCallback}
        name="earlyPickupTime"
        label="Earliest Pickup" />
    <FormDateHourPicker
        bind:hour={startTime}
        bind:date={startDate}
        on:hourChange={hourPickedCallback}
        on:dateChange={datePickedCallback}
        name="pickupTime"
        label="Pickup" />

    <span class="block my-2" />
    <FormDateHourPicker
        bind:hour={endtTime}
        bind:date={endDate}
        on:hourChange={hourPickedCallback}
        on:dateChange={datePickedCallback}
        name="deliveryTime"
        label="Delivery" />
    <FormDateHourPicker
        bind:hour={lateTime}
        bind:date={lateDate}
        on:hourChange={hourPickedCallback}
        on:dateChange={datePickedCallback}
        name="latestDeliveryTime"
        label="Latest Delivery" />
{/if}
