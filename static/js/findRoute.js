window.addEventListener('load', () => {
    if (document.querySelectorAll('#arcgis-map').length > 0) {
        loadMap();
    }
});

function loadMap() {
    console.log(sessionStorage.getItem('esriApiKey'));
    if (sessionStorage.getItem('esriApiKey') != '') {
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

        return;
    } else {
        setTimeout(loadMap, 100);
    }
}
