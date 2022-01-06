<script context="module">
    import { isLogged } from '$stores/auth';
    import { get } from 'svelte/store';
    import { browser } from '$app/env';

    export async function load() {
        if (browser) {
            const isLoggedIn = get(isLogged);

            if (isLoggedIn === 'false') {
                return { status: 302, redirect: '/auth/signin' };
            } else return {};
        } else return {};
    }
</script>

<script>
    import CloseSvg from '$components/svg/CloseSvg.svelte';
    import HamburgerSvg from '$components/svg/Hamburger.svelte';
    import TextLogo from '$components/branding/TextLogo.svelte';
    import DownSvg from '$components/svg/DownSvg.svelte';

    import { goto } from '$app/navigation';
    import { authUser } from '$stores/auth';

    const loggedUser = get(authUser).username;

    function signout() {
        isLogged.set(false);
        authUser.set({});
        goto('/');
    }

    const navItems = [{ label: 'Users', href: '#' }];
</script>

<div class="drawer drawer-mobile h-screen">
    <!-- Drawer toggler (hidden) -->
    <input id="layoutDrawer" type="checkbox" class="drawer-toggle" />

    <!-- Drawer content -->
    <main class="flex-grow flex flex-col h-screen overflow-hidden bg-base-100 text-base-content drawer-content">
        <!-- The navbar -->
        <div class="sticky inset-x-0 top-0 z-50 navbar bg-base-100  border-b border-base-300">
            <div class="lg:hidden navbar-start">
                <label for="layoutDrawer" class="btn btn-square btn-ghost">
                    <HamburgerSvg />
                </label>

                <TextLogo />
            </div>

            <div class="navbar-end lg:justify-self-end lg:w-full hidden lg:flex flex-row gap-1">
                <!-- Logged In Username -->
                <p>{loggedUser}</p>
                <!-- User dropdown menu -->
                <div class="dropdown dropdown-end">
                    <div tabindex="0" class="btn btn-circle btn-ghost btn-xs text-info">
                        <DownSvg />
                    </div>

                    <!-- Logout button -->
                    <div
                        tabindex="0"
                        class="shadow-lg border border-gray-300 card compact dropdown-content bg-base-100 rounded-box p-2 gap-1 menu">
                        <!-- <a
                            class="p-2 bg-base-100 hover:bg-base-300 rounded-lg whitespace-nowrap"
                            href="/account/settings"><p>Settings</p></a> -->
                        <button
                            class="p-2 bg-base-100 hover:bg-base-300 rounded-lg whitespace-nowrap"
                            on:click={signout}>Sign Out</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- The page contents -->
        <div class=" flex-grow">
            <slot />
        </div>
    </main>

    <!-- The mobile sidebar -->
    <div class="drawer-side border-r border-base-300">
        <label for="layoutDrawer" class="drawer-overlay border-b border-base-300" />
        <aside class="flex flex-col text-base-content w-80 bg-base-100 justify-items-stretch">
            <div
                class="sticky inset-x-0 top-0 z-50 w-full px-4 min-h-16 flex flex-row justify-between items-center border-b border-base-300 bg-base-100">
                <!-- Sidebar title -->
                <TextLogo />

                <!-- Hide sidebar button -->
                <div class="flex-none lg:hidden">
                    <label for="layoutDrawer" class="btn btn-square btn-ghost">
                        <CloseSvg />
                    </label>
                </div>
            </div>
            <!-- Navigation links -->
            <div class="flex-grow">
                <ul class="menu flex flex-col pt-2 w-80 bg-base-100 text-lg p-4">
                    {#each navItems as link}
                        <li>
                            <a
                                href={link.href}
                                on:click={() => {
                                    document.getElementById('layoutDrawer').click();
                                }}>{link.label}</a>
                        </li>
                    {/each}
                </ul>
            </div>

            <!-- Auth Links -->
            <div class="flex lg:hidden flex-col w-full p-2 border-t rounded justify-self-end">
                <!-- Logout button -->
                <div class="flex flex-row justify-center items-center">
                    <button class="btn btn-ghost btn-sm rounded-btn" on:click={signout}>Sign Out</button>
                </div>
            </div>
        </aside>
    </div>
</div>

<style lang="scss">
    .drawer-toggle {
        display: none;

        &:checked ~ .drawer-side {
            overflow: hidden;
        }
    }

    .drawer-side {
        overflow-x: hidden;
    }

    .dropdown-content.menu {
        min-width: 12rem;
    }
</style>
