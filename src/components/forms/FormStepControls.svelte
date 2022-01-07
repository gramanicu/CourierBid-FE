<script>
    import { fly, scale } from 'svelte/transition';

    export let current_step = 1;
    export let step_count = 1;
    export let valids = [false];

    export let nextStep = () => {};
    export let prevStep = () => {};
    export let submit = () => {};

    const advance = () => {
        if (valids[current_step - 1] === true) {
            if (current_step === step_count) {
                submit();
            } else {
                nextStep();
            }
        }
    };
</script>

<div class="w-full flex flex-row justify-end card-actions">
    {#if current_step !== 1}
        <button transition:fly={{ y: 20, duration: 300 }} class="btn btn-sm select-none" on:click={prevStep}
            >Prev</button>
    {/if}
    {#key current_step === step_count}
        <button
            in:scale={{ duration: 300 }}
            class="btn btn-sm"
            disabled={valids[current_step - 1] !== true}
            on:click={advance}
            >{current_step === step_count ? 'Submit' : 'Next'}
        </button>
    {/key}
</div>
