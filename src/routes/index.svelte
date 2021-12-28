<svelte:head>
    <title>Title</title>
    <meta name="description" content="Description" />
</svelte:head>

<div class="hero min-h-screen bg-color">
    <div class="hero-overlay bg-opacity-60" />
    <div class="text-center hero-content text-neutral-content">
        <div class="max-w-md">
            <h1 class="mb-5 text-5xl font-bold">Title</h1>
            <p class="mb-5">Description</p>
            <div class="flex flex-row items-center justify-center gap-4">
                <a href="/auth/signin" class="btn btn-primary btn-config text-neutral-content">Login</a>
                <a href="/auth/signup" class="btn btn-primary btn-config text-neutral-content">Signup</a>
            </div>
        </div>
    </div>
</div>

<style>
    .bg-color {
        background-position: initial;
        background: #ffffff;
        background: linear-gradient(135deg, hsla(var(--n)) -10%, hsla(var(--p)) 70%, hsla(var(--pf)) 105%);
    }
</style>
