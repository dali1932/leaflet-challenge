function createFeature(data) {
    // Your implementation for creating features from the data
}
//Store the API endpoint as queryUrl
var query = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

//Perform a GET request to the query Url
d3.json(query).then(function (data) {
    //console log the data retrieved
    console.log(data);
    //Once we get a response send the data.features object to the createFeatures function.
    createFeature(data.features);
});

//Function to determine marker size
function markerSize(magnitude) {
    return magnitude * 2000;
};

//Function to determine marker color by depth
// Shallow depth (closer to the surface): Light yellow (#FFFF00) or light green (#00FF00)
// Moderate depth: Orange (#FFA500) or red (#FF0000)
// Deep depth (further below the surface): Dark purple (#800080) or dark blue (#0000FF)
function chooseColor(depth){
    if (depth < 10) return "#FFFF00";
    else if (depth < 50) return "#FFA500";
    else if (depth < 70) return "#800080";
    else return "#0000FF";
}
function createFeature(earthquakeData) {
    //Define a function that we want to run once for each feature in the features array
    //Give each feature a popup that describes the place and time of the earthquake
    function onEachFeatureFn(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
    //Create a GeoJson layer that contains the features array on the earthquakeData object
    //Run the onEachFeatureFn once for rach piece of data in the array
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeatureFn,
        //point to layer used to alter markers
        pointToLayer: function(feature, latlng) {
            //Determine  the style of markers based on properties
            var markers = {
                radius: markerSize(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.7,
                color: "black",
                stroke: true,
                weight: 0.5
      }
            return L.circle(latlng, markers);
        }
    });
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}
function createMap(earthquakes) {

  // Create tile layer
    var grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/{style}/tiles/{z}/{x}/{y}?access_token={access_token}', {
    attribution: "<a href='https://www.mapbox.com/about/maps/'>Mapbox</a> contributors, <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    style:    'mapbox/light-v11',
    access_token: api_key
  });

  // Create our map, giving it the grayscale map and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 10,
    layers: [grayscale, earthquakes]
  });

  // Add legend
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    depth = [-10, 10, 30, 50, 70, 90];

    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
      '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap)
};
    
