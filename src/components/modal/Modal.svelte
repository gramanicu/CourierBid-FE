<script>
    export let name;
    export let successBtnName = 'Save';
    export let twoButtons = true;

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    function success() {
        dispatch('success');
    }

    function close() {
        dispatch('close');
    }
</script>

<input type="checkbox" id={name} class="modal-toggle" />
<div class="modal">
    <div class="modal-box">
        <slot />
        <div class="modal-action">
            {#if twoButtons}
                <label on:click={success} for={name} class="btn btn-success">{successBtnName}</label>
            {/if}
            <label on:click={close} for={name} class="btn">Close</label>
        </div>
    </div>
</div>
