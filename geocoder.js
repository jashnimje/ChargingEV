
// Get an instance of the geocoding service:
var geocoder = platform.getSearchService();

function geocodeAndSearch() {

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
        // name: 'Electrify',
        // at: '0.073998,51.484372',
        // categories: '700-7600-0322'

        // name: 'museum',
        // at: '52.45722,13.38044',
        // categories: '300-3100-0028'

        // Multiple Category Search
        // at: '52.45722,13.38044',
        // categories: '100-1000-0003,102-000'

        // Search using lookup
        // id: 'here:pds:place:276aabd1-9fd829e3684d05b86f7ddb1f3f83924c'

        // Search using reverse Geo code
        at: '52.5415,13.39316'

    }

    function onResult(result) {
        console.log(result);

        //Plot Every Item on the map
        // result.items.forEach(item => {
        //     map.addObject(new H.map.Marker(item.position));
        //     ui.addBubble(new H.ui.InfoBubble(item.position, {
        //         content: 'Distance: ' + item.distance + ' m'
        //     }));
        // });
    }

    // geocoder.geocode(geocoderParams, onResult, alert);
    // geocoder.discover(geocoderParams, onResult, alert); // Discover Places nearby
    // geocoder.autosuggest(geocoderParams, onResult, alert); // Auto Complete incomplete suggestion
    // geocoder.browse(geocoderParams, onResult, alert);
    // geocoder.lookup(geocoderParams, onResult, alert);
    geocoder.reverseGeocode(geocoderParams, onResult, alert);
}

geocodeAndSearch();
