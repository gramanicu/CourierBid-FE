const config = {
    mode: 'jit',
    purge: {
        content: ['src/app.html', './src/**/*.{html,js,svelte,ts,scss}'],
        enabled: true,
    },
    theme: {
        extend: {},
    },

    plugins: [require('@tailwindcss/typography'), require('daisyui')],
};

module.exports = config;
