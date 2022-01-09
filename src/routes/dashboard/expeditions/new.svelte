<script context="module">
    import { roleType, roleGuard } from '$lib/utils';
    const permittedRoles = [roleType.CLIENT];

    export async function load() {
        return roleGuard(permittedRoles);
    }
</script>

<script>
    import FormStepTracker from '$components/forms/FormStepTracker.svelte';
    import FormStepControls from '$components/forms/FormStepControls.svelte';
    import ConfirmForm from './_forms/ConfirmForm.svelte';
    import CargoTypeForm from './_forms/CargoTypeForm.svelte';
    import ExpeditionInfoForm from './_forms/ExpeditionInfoForm.svelte';
    import ExpeditionRouteForm from './_forms/ExpeditionRouteForm.svelte';

    import { onMount } from 'svelte';
    import { callBackend } from '$lib/backend';
    import { goto } from '$app/navigation';
    import { get } from 'svelte/store';
    import { authUser } from '$stores/auth';

    const steps = ['Cargo', 'Route', 'Details', 'Confirm'];
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
            if (get(authUser).id) {
                await callBackend('api/', 'POST', {});
            } else {
                return;
            }
        } catch (err) {
            console.error(err);
            return;
        }

        goto('/dashboard/expeditions');
    }

    onMount(() => {
        steps.forEach(() => {
            valids = [...valids, false];
        });
    });

    let cargo;
    let route;
    let info;
</script>

<svelte:head>
    <html lang="en-GB" />
    <title>Submit an expedition request</title>
    <meta name="description" content="A client can submit an expedition request" />
    <meta name="robots" content="noindex" />
</svelte:head>

<div class="flex flex-row justify-center mt-4">
    <div class="card shadow-lg border border-bg-base-300 card-bordered max-w-3xl">
        <div class="card-body">
            <div class="card-title">
                <FormStepTracker {steps} {current_step} />
            </div>
            <div class="flex flex-col my-2 sm:my-4">
                <CargoTypeForm bind:cargo visible={current_step === 1} bind:is_valid={valids[0]} />
                <ExpeditionRouteForm bind:route visible={current_step === 2} bind:is_valid={valids[1]} />
                <ExpeditionInfoForm bind:info visible={current_step === 3} bind:is_valid={valids[2]} />
                <ConfirmForm bind:cargo bind:info bind:route visible={current_step === 4} bind:is_valid={valids[3]} />
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
