window.addEventListener('load', () => {
    window.getCityCoordinates = getCityCoordinates;
    window.loadEsriMap = loadMap;
});

function getCityCoordinates(city, callback) {
    if (sessionStorage.getItem('esriApiKey') != '') {
        require(['esri/config', 'esri/rest/locator'], function (esriConfig, locator) {
            esriConfig.apiKey = sessionStorage.getItem('esriApiKey');

            const geocodeUrl = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer';

            let address = {
                city,
            };

            locator
                .addressToLocations(geocodeUrl, {
                    address,
                    categories: 'City',
                })
                .then(function (data) {
                    callback(data);
                });
        });
    }
}

function loadMap(containerId, callback) {
    if (sessionStorage.getItem('esriApiKey') != '') {
        require(['esri/config', 'esri/Map', 'esri/views/MapView'], function (esriConfig, Map, MapView) {
            esriConfig.apiKey = sessionStorage.getItem('esriApiKey');

            const map = new Map({
                basemap: 'arcgis-navigation',
            });

            const view = new MapView({
                map: map,
                center: [26.06, 46.06], //Longitude, latitude
                zoom: 6,
                container: containerId, // Div element
            });

            callback(view);
        });
    }
}

function track() {
    if (sessionStorage.getItem('esriApiKey') != '') {
        require([
            'esri/config',
            'esri/Map',
            'esri/views/MapView',
            'esri/Graphic',
            'esri/rest/route',
            'esri/rest/support/RouteParameters',
            'esri/rest/support/FeatureSet',
            'esri/geometry/geometryEngine',
            'esri/rest/locator',
        ], function (esriConfig, Map, MapView, Graphic, route, RouteParameters, FeatureSet, geometryEngine, locator) {
            esriConfig.apiKey = sessionStorage.getItem('esriApiKey');

            const map = new Map({
                basemap: 'arcgis-navigation', // Basemap layer service
            });

            const view = new MapView({
                map: map,
                center: [26.06, 46.06], //Longitude, latitude
                zoom: 6,
                container: 'arcgis-map', // Div element
            });

            const routeUrl = 'https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World';
            const geocodeUrl = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer';

            let address = {
                city: 'brailsa',
            };

            console.log('VVWE');

            locator
                .addressToLocations(geocodeUrl, {
                    address,
                    categories: 'City',
                })
                .then(function (data) {
                    console.log(data);
                });

            view.on('click', function (event) {
                if (view.graphics.length === 0) {
                    addGraphic('origin', event.mapPoint);
                } else if (view.graphics.length === 1) {
                    addGraphic('destination', event.mapPoint);

                    getRoute(); // Call the route service
                } else {
                    view.graphics.removeAll();
                    addGraphic('origin', event.mapPoint);
                }
            });

            function addGraphic(type, point) {
                const graphic = new Graphic({
                    symbol: {
                        type: 'simple-marker',
                        color: type === 'origin' ? 'white' : 'black',
                        size: '8px',
                    },
                    geometry: point,
                });
                view.graphics.add(graphic);
            }

            function getRoute() {
                const routeParams = new RouteParameters({
                    stops: new FeatureSet({
                        features: view.graphics.toArray(),
                    }),

                    returnDirections: true,
                });

                route
                    .solve(routeUrl, routeParams)
                    .then(function (data) {
                        data.routeResults.forEach(function (result) {
                            console.log(geometryEngine.geodesicLength(result.route.geometry, 'kilometers'));
                            result.route.symbol = {
                                type: 'simple-line',
                                color: [5, 150, 255],
                                width: 3,
                            };
                            view.graphics.add(result.route);
                        });
                    })

                    .catch(function (error) {
                        console.log(error);
                    });
            }
        });

        return;
    } else {
        setTimeout(loadMap, 1000);
    }
}
