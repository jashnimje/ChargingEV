// Get an instance of the geocoding service:
var geocoder = platform.getSearchService();

function search(placename) {
    geocoder.geocode({
        q: placename
    }, (result) => {
        // Add a marker for each location found
        result.items.forEach((item) => {
            // console.log(item.position.lat, item.position.lng);
            map.removeObjects(map.getObjects());
            getBrowserPosition();
            geocodeAndSearch(item.position.lat, item.position.lng);
            let pointerMarker = new H.map.Marker(item.position);
            pointerMarker.setData("Location: " + item.position.lat + ", " + item.position.lng);
            map.addObject(pointerMarker);
            if (item instanceof H.map.Marker) {
                ui.addBubble(bubble);
            }
        });
    }, alert);
}
// search('-1');

function geocodeAndSearch(lat, lng) {

    let geocoderParams = {
        // q: 'Abbey',
        // in: 'countryCode:GBR',
        // qq: 'street=Abbey;city=London;country=England'
        // q: 'Great Russell St, London WC1B 3DG, United Kingdom',
        // limit: 1

        // in: 'circle:52.49105,13.37917;r=1000' // Search in radius given

        // Search markets in specific location
        // q: 'markets', // free form query
        // at: '52.49105,13.37917' // position in the format latitude, longitude

        // Search incomplete query in specific location
        // q: 'star', // free form query
        // at: '52.491059,13.37917' // position in the format latitude, longitude

        // Search in Square Parameter
        // bbox:Left-longitude, bottom-latitude, right-longitude, top-latitude
        // q: 'star',
        // in: 'bbox:13.3817,52.50474,13.40432,52.51647' // Restrict parameter in a box shape

        // Search using Categories
        name: 'EV Charging Station',
        at: lat + "," + lng,
        categories: '700-7600-0322'

        // name: 'museum',
        // at: '52.45722,13.38044',
        // categories: '300-3100-0028'

        // Multiple Category Search
        // at: '52.45722,13.38044',
        // categories: '100-1000-0003,102-000'

        // Search using lookup
        // id: 'here:pds:place:276aabd1-9fd829e3684d05b86f7ddb1f3f83924c'

        // Search using reverse Geo code
        // at: '52.5415,13.39316'

    }

    function onResult(result) {
        // console.log(result);
        const mapObj = [];
        var group = new H.map.Group();
        let i = 0;
        result.items.forEach(item => {
            let amps = item.extended.evStation.connectors[0].chargingPoint.ampsRange;
            let noOfConnectors = item.extended.evStation.connectors[0].chargingPoint.numberOfConnectors;
            let EVName = item.title;
            let EVAddress = item.address.label;
            EVAddress = EVAddress.replace("EV Charging Station, ", "");
            // let EVAddress = item.address.houseNumber + " " + item.address.street + ", " + item.address.city + ", " + item.address.stateCode + " " + item.address.postalCode + ", " + item.address.countryName;

            let temp = item.extended.evStation.connectors;

            let ConString = "";
            for (let i = 0; i < temp.length; i++) {
                let connectorTypes = item.extended.evStation.connectors[i].connectorType.name;
                ConString += ((i + 1) + ") " + connectorTypes + "</br>");
            }


            let pointerMarker = new H.map.Marker(item.position, {
                icon: imageIcon,
                volatility: true,
            });
            let lat = item.position.lat;
            let lng = item.position.lng;
            // console.log(item);
            pointerMarker.setData(
                "<b>Name:</b> " + EVName +
                "</br><b>Address:</b> " + EVAddress +
                "</br> <b>Location:</b> " + lat + ", " + lng +
                "</br> <b>No. of Connectors:</b> " + noOfConnectors +
                "</br> <b>Connector Types:</b></br> " + ConString +
                "</br> <button id='bubbleButton' onclick='directions(" + lat + "," + lng + ")' >Directions</button>");

            map.addObject(pointerMarker);
            group.addObject(pointerMarker);

            if (item instanceof H.map.Marker) {
                // var bubble = new H.ui.InfoBubble(item.getGeometry(), {
                //     content: 'Distance: ' + item.distance + ' m' + amps, // data set while adding the marker object
                // });
                // show info bubble
                ui.addBubble(bubble);
            }
        });
        map.addObject(group);
        var bbox = group.getBoundingBox();
        map.getViewModel().setLookAtData({
            bounds: bbox
        });
    }

    // geocoder.geocode(geocoderParams, onResult, alert);
    // geocoder.discover(geocoderParams, onResult, alert); // Discover Places nearby
    // geocoder.autosuggest(geocoderParams, onResult, alert); // Auto Complete incomplete suggestion
    geocoder.browse(geocoderParams, onResult, alert);
    // geocoder.lookup(geocoderParams, onResult, alert);
    // geocoder.reverseGeocode(geocoderParams, onResult, alert);
}