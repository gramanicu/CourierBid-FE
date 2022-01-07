<script context="module">
    import { roleType, roleGuard } from '$lib/utils';

    const permittedRoles = [roleType.TRANSPORTER];

    export async function load() {
        return roleGuard(permittedRoles);
    }
</script>

<script>
    import FormStepTracker from '$components/forms/FormStepTracker.svelte';
    import FormStepControls from '$components/forms/FormStepControls.svelte';
    import TruckModelForm from './_forms/TruckModelForm.svelte';
    import TruckInfoForm from './_forms/TruckInfoForm.svelte';
    import ConfirmForm from './_forms/ConfirmForm.svelte';
    import { onMount } from 'svelte';
    import { callBackend } from '$lib/backend';
    import { goto } from '$app/navigation';

    const steps = ['Select model', 'Plate & Prices', 'Confirm'];
    let valids = [];
    let current_step = 1;

    function prevStep() {
        current_step = Math.max(1, current_step - 1);
    }

    function nextStep() {
        current_step = Math.min(steps.length, current_step + 1);
    }

    async function submit() {
        try {
            await callBackend('api/trucks/add', 'POST', {
                modelId: truck.modelId,
                // TODO - load the current users id
                courierId: 1,
                emptyPrice: information.empty_price,
                fullPrice: information.full_price,
                registryPlate: information.license_plate,
            });
        } catch (err) {
            console.error(err);
            return;
        }

        goto('/dashboard/trucks');
    }

    let truck = null;
    let information = {
        empty_price: null,
        full_price: null,
        license_plate: null,
    };

    onMount(() => {
        steps.forEach(() => {
            valids = [...valids, false];
        });
    });
</script>

<svelte:head>
    <html lang="en-GB" />
    <title>Add trucks</title>
    <meta name="description" content="A transporter can list his trucks" />
    <meta name="robots" content="noindex" />
</svelte:head>

<div class="flex flex-row justify-center mt-4">
    <div class="card shadow-lg border border-bg-base-300 card-bordered max-w-3xl">
        <div class="card-body">
            <div class="card-title">
                <FormStepTracker {steps} {current_step} />
            </div>
            <div class="flex flex-col my-2 sm:my-4">
                <TruckModelForm bind:currentModel={truck} visible={current_step === 1} bind:is_valid={valids[0]} />
                <TruckInfoForm bind:information visible={current_step === 2} bind:is_valid={valids[1]} />
                <ConfirmForm bind:truck bind:information visible={current_step === 3} bind:is_valid={valids[2]} />
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
