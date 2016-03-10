
d3.csv("/dataset/ptbusiness.csv", function(err, data) {
  if (err) throw error;

  //initialize map
  L.mapbox.accessToken = 'pk.eyJ1Ijoic3JpOTYiLCJhIjoiY2lsZ2JwaDNmMmM5ZXZubWNzdzQ1NmJ0NSJ9._NbPwArBh8O9HKpmWsHOMg';
  var geocoder = L.mapbox.geocoder('mapbox.places'),
      map = L.mapbox.map('map', 'examples.map-h67hf2ic');

  var markers;

  //getAvgStarByArea(data, 40.35761, 40.3922071, -80.070898, -80.05998);
  drawMap(data);

  // function getAvgStarByArea(data, minLat, maxLat, minLong, maxLong){
  //   var avgStars;
  //   var count = 0;
  //   for (var i = 0; i < data.length; i++){
  //     var lat = Number(data[i]["latitude"]);
  //     var long = Number(data[i]["longitude"]);
  //     var stars = Number(data[i]["stars"]);
  //     if (lat > minLat && lat <= maxLat && long > minLong && long <= maxLong){
  //       if (avgStars == null) avgStars = stars;
  //       else avgStars = (avgStars*count + stars)/(count + 1);
  //       count++;
  //     }
  //   }

  //   console.log(avgStars);
  // }

  $('#ratingFilter').on('click', function(){
      var stars = $('#ratingInput').val();
      var starFilterData = [];
      var count = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i]["stars"] >= stars){
          starFilterData[count] = data[i];
          count++;
        }
      }

      map.removeLayer(markers);
      drawMap(starFilterData);
  });

  // function findMinLat(data){
  //   var minLat = data[0]["latitude"];
  //   for (var i = 1; i < data.length; i++){
  //     var lat = data[i]["latitude"];
  //     if (lat < minLat) lat = minLat;
  //   }

  //   return minLat;
  // }

  function drawMap(data){

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

      markers = new L.MarkerClusterGroup();

      for (var i = 0; i < data.length; i++) {
          var lat = data[i]["latitude"];
          var long = data[i]["longitude"];

          var title = data[i]["name"] + data[i]["stars"];
          var marker = L.marker(new L.LatLng(lat, long), {
              icon: L.mapbox.marker.icon({'marker-color': '0044FF'}),
              title: title
          });
          marker.bindPopup(title);
          markers.addLayer(marker);
      }

      map.addLayer(markers);
  }


});
