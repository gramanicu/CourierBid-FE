window.addEventListener('load', () => {
    console.log('ASDKJHAS');

    require(['esri/config', 'esri/Map', 'esri/views/MapView'], function (esriConfig, Map, MapView) {
        esriConfig.apiKey = sessionStorage.getItem('esriApiKey');

        const map = new Map({
            basemap: 'arcgis-topographic', // Basemap layer service
        });

        const view = new MapView({
            map: map,
            center: [-118.805, 34.027], // Longitude, latitude
            zoom: 13, // Zoom level
            container: 'arcgis-map', // Div element
        });
    });
});
