<script context="module">
    import { roleType, roleGuard } from '$lib/utils';
    const permittedRoles = [roleType.TRANSPORTER];

    export async function load() {
        return roleGuard(permittedRoles);
    }
</script>

<script>
    import { onMount } from 'svelte';
    import { callBackend } from '$lib/backend';
    import { goto } from '$app/navigation';
    import FormStepTracker from '$components/forms/FormStepTracker.svelte';
    import FormStepControls from '$components/forms/FormStepControls.svelte';
    import SelectTruckForm from './_forms/SelectTruckForm.svelte';

    const steps = ['Truck', 'Pickup', 'Delivery', 'Information', 'Confirm'];
    let valids = [];
    let current_step = 1;

    function prevStep() {
        current_step = Math.max(1, current_step - 1);
    }

    function nextStep() {
        current_step = Math.min(steps.length, current_step + 1);
    }

    async function submit() {
        return;
        try {
            await callBackend('api/transports/add', 'POST', {
                // truckId,
                // startLocation,
                // startTime,
                // endLocation,
                // endTime
            });
        } catch (err) {
            console.error(err);
            return;
        }

        goto('/dashboard/trucks');
    }

    let truck;
    let start;
    let end;
    let information;

    onMount(() => {
        steps.forEach(() => {
            valids = [...valids, false];
        });
    });
</script>

<svelte:head>
    <html lang="en-GB" />
    <title>Add new transport</title>
    <meta name="description" content="A transporter can create a new transport offer" />
    <meta name="robots" content="noindex" />
</svelte:head>

<div class="flex flex-row justify-center mt-4">
    <div class="card shadow-lg border border-bg-base-300 card-bordered max-w-3xl">
        <div class="card-body">
            <div class="card-title">
                <FormStepTracker {steps} {current_step} />
            </div>
            <div class="flex flex-col my-2 sm:my-4">
                <SelectTruckForm bind:currentTruck={truck} visible={current_step === 1} bind:is_valid={valids[0]} />
                <!-- <TruckModelForm bind:currentModel={truck} visible={current_step === 1} bind:is_valid={valids[0]} />
                <TruckInfoForm bind:information visible={current_step === 2} bind:is_valid={valids[1]} />
                <ConfirmForm bind:truck bind:information visible={current_step === 3} bind:is_valid={valids[2]} /> -->
            </div>
            <div class="card-actions">
                <FormStepControls
                    bind:valids
                    bind:current_step
                    bind:step_count={steps.length}
                    {nextStep}
                    {prevStep}
                    {submit} />
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .card {
        min-width: 320px;
    }
</style>
