// export const lat, lng;
// Get an instance of the routing service version 8:
var router = platform.getRoutingService(null, 8);
function directions(lat, lng) {

    // console.log(lat, lng);
    // Now I can use the promise followed by .then() 
    // to make use of the values anywhere in the program
    getLocationPromise.then((location) => {

        currLat = location.latitude;
        currLng = location.longitude;
        // currLat = 37.581255;
        // currLng = -120.9282888;
        console.log(currLat + ", " + currLng);
        // Create the parameters for the routing request:
        EVLocation(currLat, currLng, lat, lng);

    }).catch((err) => {
        console.log(err);
    })
}
// Creating a promise out of the function
let getLocationPromise = new Promise((resolve, reject) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

            lat = position.coords.latitude
            long = position.coords.longitude

            // Resolving the values which I need
            resolve({
                latitude: lat,
                longitude: long
            })
        })

    } else {
        reject("your browser doesn't support geolocation API")
    }
})



function EVLocation(currLat, currLng, destLat, destLng) {
    var routingParameters = {
        transportMode: 'car',
        routingMode: 'fast',
        origin: currLat + "," + currLng,
        destination: destLat + "," + destLng,
        // via: '52.505582,13.3692024!stopDuration=900',
        // alternatives: 3,
        departureTime: '2020-05-13T09:00:00',
        return: 'polyline,summary,actions,instructions',
        spans: 'speedLimit'
    };

    // Define a callback function to process the routing response:
    var onResult = function (result) {
        console.log(result);
        if (result.routes.length) {
            result.routes.forEach(route => {

                let totalLength = 0;
                let totalDuration = 0;
                // result.routes.forEach(route =>{
                route.sections.forEach((section) => {
                    // Create a linestring to use as a point source for the route line
                    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

                    // Create a polyline to display the route:
                    // let routeLine = new H.map.Polyline(linestring, {
                    //     style: { strokeColor: '#034F84', lineWidth: 3 }
                    // });

                    // Create a polyline to display the route in dashed form:
                    let routeLine = new H.map.Polyline(linestring, {
                        style: { strokeColor: '#034F84', lineWidth: 3, lineDash: [1, 2] }
                    });

                    // Create a marker for the start point:
                    let startMarker = new H.map.Marker(section.departure.place.location);

                    // Create a marker for the end point:
                    let endMarker = new H.map.Marker(section.arrival.place.location);

                    // Summary from the endpoints
                    totalLength += section.summary.length;
                    totalDuration += section.summary.duration;

                    // Add the route polyline and the two markers to the map:
                    map.addObjects([routeLine, startMarker, endMarker]);

                    // Set the map's viewport to make the whole route visible:
                    map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });

                    // Step by Step Directions
                    // section.actions.forEach(action => {
                    //     document.getElementById("panel").innerHTML += `<br>` + action.instruction;

                    // });
                });
                document.getElementById("panel").innerHTML += 'Route ' + (result.routes.indexOf(route) + 1) + ' Distance: ' + totalLength / 1000 + ' Km' + ' Duration: ' + totalDuration.toMMSS() + `<br>`;
            });

        }
    };

    // error callback function
    var onError = function (error) {
        alert(error.message);
    };

    Number.prototype.toMMSS = function () {
        return Math.floor(this / 60) + ' minutes ' + (this % 60) + ' seconds.';
    }

    // Call calculateRoute() with the routing parameters,
    // the callback and an error callback function 
    router.calculateRoute(routingParameters, onResult, onError);
}