// Set up map
var map = L.map('mapdiv', {
    zoomControl: false                  // remove top left zoom controls
}).setView([1.350270, 103.829959],12);  // lat and long coordinates + initial zoom

// zoom buttons to bottom right
L.control.zoom({ position: 'bottomright' }).addTo(map);

// disable double click zoom
map.doubleClickZoom.disable(); 

// custom marker icons
var LeafIcon = L.Icon.extend({
    options: {
        iconSize:     [40, 40],
        iconAnchor:   [20, 40],
        popupAnchor:  [0, -25]
    }
});

var chaoticRestless = new LeafIcon({iconUrl: '../../static/images/customIcons/pink-marker.png'}),
    fulloflifeExciting = new LeafIcon({iconUrl: '../../static/images/customIcons/orange-marker.png'}),
    calmTranquil = new LeafIcon({iconUrl: '../../static/images/customIcons/green-marker.png'}),
    boringLifeless = new LeafIcon({iconUrl: '../../static/images/customIcons/black-marker.png'});


const fulloflifeExciting_array = [];
const chaoticRestless_array = [];
const calmTranquil_array = [];
const boringLifeless_array = [];

// add markers
$.get('../../static/csv/locations.csv', function(csvString) {
    // Use PapaParse to convert string to array of objects
    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

    // For each row in data, create a marker and add it to the map
    for (var i in data) {
        var row = data[i];
    
        // create a closure to preserve the value of row
        (function(row) {

            switch (row.Type) {
                case 'F&E':
                    row.Type = fulloflifeExciting;
                    var attribute = '<img class="orange-att"> Full of Life and Exciting';
                    // create marker, add it to layer, and push into array
                    var marker = L.marker([
                        parseFloat(row.Latitude), 
                        parseFloat(row.Longitude)
                    ], { opacity: 1, icon: row.Type });
                    fulloflifeExciting_layer.addLayer(marker);
                    fulloflifeExciting_array.push(marker);
                    break;
                case 'B&L':
                    row.Type = boringLifeless;
                    var attribute = '<img class="black-att"> Boring and Lifeless';
                    // create marker, add it to layer, and push into array
                    var marker = L.marker([
                        parseFloat(row.Latitude), 
                        parseFloat(row.Longitude)
                    ], { opacity: 1, icon: row.Type });
                    boringLifeless_layer.addLayer(marker);
                    boringLifeless_array.push(marker);
                    break;
                case 'C&T':
                    row.Type = calmTranquil;
                    var attribute = '<img class="green-att"> Calm and Tranquil';
                    // create marker, add it to layer, and push into array
                    var marker = L.marker([
                        parseFloat(row.Latitude), 
                        parseFloat(row.Longitude)
                    ], { opacity: 1, icon: row.Type });
                    calmTranquil_layer.addLayer(marker);
                    calmTranquil_array.push(marker);
                    break;
                case 'C&R':
                    row.Type = chaoticRestless;
                    var attribute = '<img class="pink-att"> Chaotic and Restless';
                    // create marker, add it to layer, and push into array
                    var marker = L.marker([
                        parseFloat(row.Latitude), 
                        parseFloat(row.Longitude)
                    ], { opacity: 1, icon: row.Type });
                    chaoticRestless_layer.addLayer(marker);
                    chaoticRestless_array.push(marker);
                    break;
            }
    
            marker.on('click', function() {
                L.control.window(map,{title:row.Title, modal: false})
                    .content(
                        // youtube video
                        '<div class="youtube-container"><iframe src="' + 
                        row.vidEmbed + 
                        '?&autoplay=1&loop=1&modestbranding=1"frameborder="0" allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>' + 
                        // recording links
                        '<div class="window-content">' + 
                            '<div class="left-col">' +
                                '<p class="window-content-title">Recording Links:</p>' +
                                '<a href="' + row.vidLink_oneMin + '" class="vid-link">1 Minute Recording</a><br>' +
                                '<a href="' + row.vidLink_full + '" class="vid-link">Full Recording (camera audio and video only)</a>' +
                            '</div>' +
                            '<div class="right-col">' + attribute + '</div>'
                    )
                    .prompt({})
                    .show()
            });
        })(row); // immediately invoke the closure with row as an argument
    }    
});

// layer groups
var fulloflifeExciting_layer = L.layerGroup(fulloflifeExciting_array).addTo(map);
var chaoticRestless_layer = L.layerGroup(chaoticRestless_array).addTo(map);
var calmTranquil_layer = L.layerGroup(calmTranquil_array).addTo(map);
var boringLifeless_layer = L.layerGroup(boringLifeless_array).addTo(map);

// add map tile layer
var basemap = L.tileLayer('https://maps-{s}.onemap.sg/v3/Grey/{z}/{x}/{y}.png', {
    detectRetina: true,
    maxZoom: 20,
    minZoom: 11,
    attribution: '<a href="https://www.onemap.gov.sg/home/">OneMap</a> | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>',
    layers: [
        fulloflifeExciting_layer,
        chaoticRestless_layer,
        calmTranquil_layer,
        boringLifeless_layer
    ]
}).addTo(map);

// set max bounds of map
map.setMaxBounds([[1.50073, 104.1147], [1.16, 103.602]]);

var overlayMaps = {
    "<img class='orange-att'> Full of Life and Exciting": fulloflifeExciting_layer,
    "<img class='pink-att'> Chaotic and Restless": chaoticRestless_layer,
    "<img class='green-att'> Calm and Tranquil": calmTranquil_layer,
    "<img class='black-att'> Boring and Lifeless": boringLifeless_layer
};

// add overlay layers to map and pass an empty object for the base layers argument
var layerControl = L.control.layers({}, overlayMaps, {
    position: 'topleft',
    collapsed: false,
    className: 'typesLayerControl'
}).addTo(map); 

// button click layer control
$('.leaflet-control-layers').hide();
$('.leaflet-control-layers').css('top','100px');

btn.onclick = function() {
    $('.leaflet-control-layers').toggle();
}

// add filter title
$(".leaflet-control-layers-overlays").prepend("<label class='layer-control-label'>Perceptual Attributes</label>");
