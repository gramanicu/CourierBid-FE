import preprocess from 'svelte-preprocess';
import vercel from '@sveltejs/adapter-vercel';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        // hydrate the <div id="svelte"> element in src/app.html
        target: '#svelte',
        adapter: vercel(),

        vite: {
            resolve: {
                alias: {
                    $components: path.resolve('./src/components'),
                    $stores: path.resolve('./src/stores'),
                    $scss: path.resolve('./src/scss'),
                    $lib: path.resolve('./src/lib'),
                },
            },
        },
    },

    preprocess: [
        preprocess({
            postcss: true,
        }),
    ],
};

export default config;
