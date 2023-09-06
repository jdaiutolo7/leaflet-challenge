// Use this link to get the GeoJSON earthquake data.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(url).then(function (data) {
    // Console log the data 
    console.log(data);
    // Send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });
  
  // Function to determine marker size
  function markerSize(magnitude) {
    return magnitude * 1000;
  };
  
  // Function to determine marker color based on earthquake depth
  function chooseColor(depth) {
    if (depth <= 10) return "green";
    else if (depth > 10 & depth <= 25) return "greenyellow";
    else if (depth > 25 & depth <= 40) return "yellow";
    else if (depth > 40 & depth <= 55) return "orange";
    else if (depth > 55 & depth <= 70) return "orangered";
    else return "red";
  }

  // Use function to create features of data
  function createFeatures(data) {
  
    // Define a function for each feature providing descriptions of each earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
  
    // Create GeoJSON layer and run function for each piece of data
    var earthquakes = L.geoJSON(data, {
      onEachFeature: onEachFeature,
  
      // Function to adjust markers
      pointToLayer: function(feature, latlng) {
  
        // Adjust marker style
        var markers = {
          radius: markerSize(feature.properties.mag * 10),
          fillColor: chooseColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.7,
          color: "black",
          stroke: true,
          weight: 1.0
        }
        return L.circle(latlng,markers);
      }
    });
  
    // Add earthquakes layer
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
  
    // Create tile layer
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
  
    // Create grayscale map
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 3,
      layers: [streetmap, earthquakes]
    });
  
    // Add legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "legend"),
      depth = [-10, 10, 30, 50, 70, 90];
  
      for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
        '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
      }
      return div;
    };
    legend.addTo(myMap)
  };