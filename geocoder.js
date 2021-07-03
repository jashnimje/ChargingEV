
// Get an instance of the geocoding service:
var geocoder = platform.getSearchService();

function geocodeAndSearch() {

    let geocoderParams = {
        // q: 'Abbey',
        // in: 'countryCode:GBR',
        // qq: 'street=Abbey;city=London;country=England'
        q: 'Great Russell St, London WC1B 3DG, United Kingdom',
        limit: 1
    }

    function onResult(result) {
        console.log(result);
        map.addObject(new H.map.Marker(result.items[0].position));
    }

    geocoder.geocode(geocoderParams, onResult, alert);

}

geocodeAndSearch();
