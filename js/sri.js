
// var ptNeighborhoods = {
//   "Hazelwood": [40.397137, 40.425043, -79.954435, -79.923252],
//   "Lawrenceville": 
// }

// var lvNeighborhoods = {
//   "North Las Vegas": [36.195446, 36.334702, -115.206899, -114.967393],
//   "Downtown": [36.159622, 36.181393, -115.151431, -115.115212],

// }


d3.csv("/dataset/ptbusiness.csv", function(err, data) {
  if (err) throw error;

  getAvgStarByArea(data, 40.35761, 40.3922071, -80.070898, -80.05998);
  drawMap(data);

});

function getAvgStarByArea(data, minLat, maxLat, minLong, maxLong){
  var avgStars;
  var count = 0;
  for (var i = 0; i < data.length; i++){
    var lat = Number(data[i]["latitude"]);
    var long = Number(data[i]["longitude"]);
    var stars = Number(data[i]["stars"]);
    if (lat > minLat && lat <= maxLat && long > minLong && long <= maxLong){
      if (avgStars == null) avgStars = stars;
      else avgStars = (avgStars*count + stars)/(count + 1);
      count++;
    }
  }

  console.log(avgStars);
}

function findMinLat(data){
  var minLat = data[0]["latitude"];
  for (var i = 1; i < data.length; i++){
    var lat = data[i]["latitude"];
    if (lat < minLat) lat = minLat;
  }

  return minLat;
}

function drawMap(data){
  L.mapbox.accessToken = 'pk.eyJ1Ijoic3JpOTYiLCJhIjoiY2lsZ2JwaDNmMmM5ZXZubWNzdzQ1NmJ0NSJ9._NbPwArBh8O9HKpmWsHOMg';
  var geocoder = L.mapbox.geocoder('mapbox.places'),
      map = L.mapbox.map('map', 'examples.map-h67hf2ic');

  geocoder.query('Pittsburgh, PA', showMap);

  function showMap(err, data) {
      // The geocoder can return an area, like a city, or a
      // point, like an address. Here we handle both cases,
      // by fitting the map bounds to an area or zooming to a point.
      if (data.lbounds) {
          map.fitBounds(data.lbounds);
      } else if (data.latlng) {
          map.setView([data.latlng[0], data.latlng[1]], 15);
      }
  }

  // for (var i = 0; i < data.length; i++){
  //   var lat = data[i]["latitude"];
  //   var long = data[i]["longitude"];

  //   var marker = L.marker([lat, long], {
  //       icon: L.mapbox.marker.icon({
  //         'marker-color': '#CD6889',
  //       })
  //   });

  //   marker.setOpacity(.1)
  //   marker.addTo(map);
  // }

//'marker-symbol': 'post', 

    var markers = new L.MarkerClusterGroup();

    for (var i = 0; i < data.length; i++) {
        var lat = data[i]["latitude"];
        var long = data[i]["longitude"];

        var title = data[i]["name"];
        var marker = L.marker(new L.LatLng(lat, long), {
            icon: L.mapbox.marker.icon({'marker-color': '0044FF'}),
            title: title
        });
        marker.bindPopup(title);
        markers.addLayer(marker);
    }

    map.addLayer(markers);
}
