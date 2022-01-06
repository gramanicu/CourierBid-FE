<script>
    export let steps;
    export let current_step = 1;
</script>

<ul class="w-full steps steps-horizontal">
    {#each steps as step, index}
        <li class="step {index < current_step ? 'step-primary' : ''}">
            {step}
        </li>
    {/each}
</ul>

<style lang="scss">
    .steps {
        .step {
            @media only screen and (max-width: 478px) {
                font-size: 0;
                margin-bottom: -30px;
            }

            &:after {
                font-size: 20px;
                transition: linear 0.5s;
            }
            &:before {
                font-size: 20px;
                transform: scaleX(0);
                transform-origin: left center;
                transition: linear 0.5s;
                transition-delay: 0.2s;
            }
        }

        .step-primary {
            &:after {
                transition: linear 0.5s;
                transition-delay: 0.2s;
            }
            &:before {
                transform: scaleX(1);
                transform-origin: left center;
                transition: linear 0.5s;
            }
        }
    }
</style>
