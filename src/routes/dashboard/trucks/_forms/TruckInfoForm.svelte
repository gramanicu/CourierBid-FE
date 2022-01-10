<script>
    import FormInputPrice from '$components/forms/FormInputPrice.svelte';
    import FormInputText from '$components/forms/FormInputText.svelte';

    export let visible = false;
    export let is_valid = false;
    let order_correct = false;

    export let information = {
        empty_price: '',
        full_price: '',
        license_plate: '',
    };

    function verifyOrder() {
        order_correct = information.empty_price >= information.full_price;
    }

    function checkValid() {
        verifyOrder();
        if (information.empty_price && information.full_price && information.license_plate && order_correct) {
            is_valid = true;
        }
    }
</script>

{#if visible}
    <div class="grid grid-cols-1 md:grid-cols-2  w-full gap-0 md:gap-4">
        <FormInputPrice
            on:input={checkValid}
            bind:value={information.empty_price}
            currency="RON"
            name="empty_price"
            placeholder="Empty Price"
            label="Empty Price (per km)" />
        <FormInputPrice
            on:input={checkValid}
            bind:value={information.full_price}
            currency="RON"
            name="full_price"
            placeholder="Full Price"
            label="Full Price (per km)" />
    </div>
    {#if !order_correct}
        <small class="mt-2 text-error">*adding more cargo should decrease the asked price</small>
    {/if}
    <FormInputText
        on:input={checkValid}
        bind:value={information.license_plate}
        name="license_plate"
        placeholder="License Plate"
        label="License Plate" />
{/if}

<style lang="scss">
    small {
        font-size: 0.6rem;
    }
</style>
