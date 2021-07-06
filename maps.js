// Initialize platform with JS API KEY
var platform = new H.service.Platform({
    apikey: window.hereCreds.JSKEY
});

// initializing default layers for the map
var defaultLayers = platform.createDefaultLayers();
// rendering map within the container on the page
var map = new H.Map(
    document.getElementById("mapContainer"),
    defaultLayers.vector.normal.map, // rendering vector map with NORMAL map view.
    {
        zoom: 11, // Initial zoom level of map
        center: {
            lat: 51.528308,
            lng: -0.3817811
        }, // Initial center of map
    }
);
// creating default UI for map
var ui = H.ui.UI.createDefault(map, defaultLayers);
// initialize basic map events
var mapEvents = new H.mapevents.MapEvents(map);
// Initialize for map behaviour on events
var behavior = new H.mapevents.Behavior(mapEvents);


// Map Style
// function mapStyle() {
//     var provider = map.getBaseLayer().getProvider();

//     var mapStyle = new H.map.Style(
//         "Resources/font_arial.yaml",
//         "https://js.api.here.com/v3/3.1/styles/omv/"
//     );

//     provider.setStyle(mapStyle);

//     // Change Language
//     var ui = H.ui.UI.createDefault(map, defaultLayers, 'de-DE');

//     // Change Default location of Controls
//     var mapSettings = ui.getControl('mapsettings');
//     mapSettings.setAlignment('top-right');

//     // Change the Meter to Mile
//     ui.setUnitSystem(H.ui.UnitSystem.IMPERIAL);
// }

// Hospital Color Change
// function highlightHosp() {
//     var hospStyle = provider.getStyle();
//     var hospConfig = hospStyle.extractConfig('landuse.hospital');
//     hospConfig.layers.landuse.hospital.draw.polygons.color = 'rgb(255,0,0)';
//     hospStyle.mergeConfig(hospConfig);
// }

// adjust tilt and rotation of the map
// map.getViewModel().setLookAtData({
//     tilt: 60,
//     //heading: 90, // angle relative to North
// });

function getBrowserPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            // console.log(position.coords);
            let browserPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            let marker = new H.map.Marker(browserPosition);
            marker.setData("Location: " + browserPosition.lat + ", " + browserPosition.lng);
            map.addObject(marker);
            if (position instanceof H.map.Marker) {
                ui.addBubble(bubble);
            }
        });
    } else {
        alert("Geolocation is not supported by this browser!");
    }
}

// Current Default Marker
var imageIcon = new H.map.Icon("Resources/marker.svg");


// Add tap event listener:
function clickToMark() {

    map.addEventListener("tap", function (evt) {
        if (evt.target instanceof H.map.Marker) {
            // checking if the tapped obeject on the map is already a marker
            var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
                // read custom data
                content: evt.target.getData(), // data set while adding the marker object
            });
            // show info bubble
            ui.addBubble(bubble);
        }
        // else {
        //     // Log 'tap' and 'mouse' events:
        //     console.log(evt);
        //     let pointer = evt.currentPointer;
        //     let pointerPosition = map.screenToGeo(
        //         pointer.viewportX,
        //         pointer.viewportY
        //     );
        //     let pointerMarker = new H.map.Marker(pointerPosition, {
        //         icon: imageIcon,
        //         volatility: true,
        //     });
        //     pointerMarker.draggable = true;
        //     pointerMarker.setData("Charging EV Data: " + pointerPosition);
        //     map.addObject(pointerMarker);
        // }
    });
}

function clickDragMarkers(map, behavior) {

    // Customize the Circle
    var circleStyle = {
        fillColor: "RGBA(153, 233, 242, 0.1)",
        strokeColor: "RGB(11, 114, 133)",
        lineWidth: 3,
    };

    // disable the default draggability of the underlying map
    // and calculate the offset between mouse and target's position
    // when starting to drag a marker object:
    map.addEventListener(
        "dragstart",
        function (ev) {
            var target = ev.target,
                pointer = ev.currentPointer;
            if (target instanceof H.map.Marker) {
                var targetPosition = map.geoToScreen(target.getGeometry());
                target["offset"] = new H.math.Point(
                    pointer.viewportX - targetPosition.x,
                    pointer.viewportY - targetPosition.y
                );
                behavior.disable();
            }
        },
        false
    );

    // re-enable the default draggability of the underlying map
    // when dragging has completed
    map.addEventListener(
        "dragend",
        function (ev) {
            var target = ev.target;
            if (target instanceof H.map.Marker) {
                var circle = new H.map.Circle(target.getGeometry(), 10000, {
                    style: circleStyle,
                });
                // Add the circle to the map:
                map.addObject(circle);
                behavior.enable();
            }
        },
        false
    );

    // Listen to the drag event and move the position of the marker
    // as necessary
    map.addEventListener(
        "drag",
        function (ev) {
            var target = ev.target,
                pointer = ev.currentPointer;
            if (target instanceof H.map.Marker) {
                target.setGeometry(
                    map.screenToGeo(
                        pointer.viewportX - target["offset"].x,
                        pointer.viewportY - target["offset"].y
                    )
                );
            }
        },
        false
    );
}

getBrowserPosition();
clickToMark();
// clickDragMarkers(map, behavior);