<script context="module">
    export function load({ error, status }) {
        return {
            props: {
                title: `${status}: ${error.message}`,
                err_obj: {
                    stat: status,
                    msg: error.message,
                },
            },
        };
    }
</script>

<script>
    export let title;
    export let err_obj;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="hero min-h-screen">
    <div class="hero-overlay bg-opacity-60" />
    <div class="text-center hero-content text-neutral-content">
        <div class="max-w-md">
            <h1 class="mb-5 text-5xl font-bold">
                {err_obj.stat}
            </h1>
            <p class="mb-5">
                {err_obj.msg}
            </p>
            <a href="/" class="btn btn-ghost">Go to homepage</a>
        </div>
    </div>
</div>

<style>
    div.hero {
        background: #0f2027;
        background: linear-gradient(to right, #2c5364, #203a43, #0f2027);
    }
</style>
