window.addEventListener('load', () => {
    window.getCityCoordinates = getCityCoordinates;
    window.loadEsriMap = loadMap;
    window.centerMap = centerMap;
    window.mapAddPoint = addPoint;
    window.mapRemovePoints = clearPoints;
    window.computeRoute = buildRoute;
    window.routeLength = routeLength;
    window.addTruck = addTruck;
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
                    countryCode: 'RO',
                })
                .then(function (data) {
                    callback(data);
                });
        });
    }
}

function centerMap(view, point, zoomLevel = 9) {
    view.goTo({
        center: [point.lng, point.lat],
        zoom: zoomLevel,
    });
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
                center: [25.08, 45.5],
                zoom: 4,
                container: containerId, // Div element
            });

            callback(map, view);
        });
    }
}

function clearPoints(view) {
    if (sessionStorage.getItem('esriApiKey') != '') {
        view.graphics.removeAll();
    }
}

function addTruck(view, location, title, description) {
    if (sessionStorage.getItem('esriApiKey') != '') {
        require(['esri/Graphic'], function (Graphic) {
            const point = {
                type: 'point',
                longitude: location.lng,
                latitude: location.lat,
            };

            const color = [0, 0, 255];

            const attributes = {
                Title: title,
                Description: description,
            };

            const graphic = new Graphic({
                symbol: {
                    type: 'simple-marker',
                    color: color,
                    size: '12px',
                    outline: {
                        color: [0, 0, 0],
                        width: 2,
                    },
                },
                popupTemplate: {
                    title: '{Title}',
                    content: '{Description}',
                },
                attributes,
                geometry: point,
            });
            view.graphics.add(graphic);
        });
    }
}

function addPoint(view, location, type, callback) {
    if (sessionStorage.getItem('esriApiKey') != '') {
        require(['esri/Graphic'], function (Graphic) {
            const point = {
                type: 'point',
                longitude: location.lng,
                latitude: location.lat,
            };

            const color = type === 'start' ? [255, 255, 0] : [255, 0, 0];

            const graphic = new Graphic({
                symbol: {
                    type: 'simple-marker',
                    color: color,
                    size: '12px',
                    outline: {
                        color: [0, 0, 0],
                        width: 2,
                    },
                },
                geometry: point,
            });
            view.graphics.add(graphic);
            if (callback) {
                callback();
            }
        });
    }
}

function buildRoute(view, callback) {
    require([
        'esri/rest/route',
        'esri/rest/support/RouteParameters',
        'esri/rest/support/FeatureSet',
        'esri/geometry/geometryEngine',
    ], function (route, RouteParameters, FeatureSet, geometryEngine) {
        const routeParams = new RouteParameters({
            stops: new FeatureSet({
                features: view.graphics.toArray(),
            }),

            returnDirections: false,
        });

        const routeUrl = 'https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World';

        route
            .solve(routeUrl, routeParams)
            .then(function (data) {
                data.routeResults.forEach(function (result) {
                    let routeLength = geometryEngine.geodesicLength(result.route.geometry, 'kilometers');

                    result.route.symbol = {
                        type: 'simple-line',
                        color: [5, 150, 255],
                        width: 3,
                    };

                    view.graphics.add(result.route);
                    if (callback) {
                        const intervalSize = Math.ceil(result.route.geometry.paths[0].length / 100);
                        let path = [];
                        for (i = intervalSize; i < result.route.geometry.paths[0].length; i += intervalSize) {
                            path.push(result.route.geometry.paths[0][i]);
                        }

                        callback(routeLength, path);
                    }
                });
            })

            .catch(function (error) {
                console.log(error);
            });
    });
}

function routeLength(p1, p2, callback) {
    require([
        'esri/rest/route',
        'esri/rest/support/RouteParameters',
        'esri/rest/support/FeatureSet',
        'esri/geometry/geometryEngine',
        'esri/Graphic',
        'esri/geometry/Point',
    ], function (route, RouteParameters, FeatureSet, geometryEngine, Graphic, Point) {
        const stops = new FeatureSet({
            features: [
                new Graphic({
                    geometry: new Point({
                        x: p1.lng,
                        y: p1.lat,
                    }),
                }),
                new Graphic({
                    geometry: new Point({
                        x: p2.lng,
                        y: p2.lat,
                    }),
                }),
            ],
        });

        const routeParams = new RouteParameters({
            stops,
            returnDirections: true,
        });

        const routeUrl = 'https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World';

        route
            .solve(routeUrl, routeParams)
            .then(function (data) {
                data.routeResults.forEach(function (result) {
                    let routeLength = geometryEngine.geodesicLength(result.route.geometry, 'kilometers');
                    if (callback) {
                        const intervalSize = Math.ceil(result.route.geometry.paths[0].length / 100);
                        let path = [];
                        for (i = intervalSize; i < result.route.geometry.paths[0].length; i += intervalSize) {
                            path.push(result.route.geometry.paths[0][i]);
                        }
                        callback(routeLength, path);
                    }
                });
            })

            .catch(function (error) {
                console.log(error);
            });
    });
}
