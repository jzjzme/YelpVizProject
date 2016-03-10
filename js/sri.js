
d3.csv("data/WI_Business_Data.csv", function(err, dataWI) {
  d3.csv("data/AZ_Business_Data.csv", function(err, dataAZ) {
    d3.csv("data/~$Vegas_Business_Data.csv", function(err, dataVegas) {
      d3.csv("data/IL_Business_Data.csv", function(err, dataIL) {
        d3.csv("data/PA_Business_Data.csv", function(err, dataPA) {
          if (err) throw error;

          //initialize map
          L.mapbox.accessToken = 'pk.eyJ1Ijoic3JpOTYiLCJhIjoiY2lsZ2JwaDNmMmM5ZXZubWNzdzQ1NmJ0NSJ9._NbPwArBh8O9HKpmWsHOMg';
          var geocoder = L.mapbox.geocoder('mapbox.places'),
              map = L.mapbox.map('map', 'examples.map-h67hf2ic');

          var markers;

          //data to visualize
          var cityToggle = ["Las Vegas, NV", "Urbana-Champaign, IL", "Phoenix, AZ", "Madison, WI", "Pittsburgh, PA"];
          var dataToggle = [dataVegas, dataIL, dataAZ, dataWI, dataPA];
          
          var currentCity = cityToggle[4];
          var data = dataToggle[4];
          $('#cityTitle').html(currentCity);


          drawMap(data, currentCity);

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
              drawMap(starFilterData, currentCity);
          });

          $('.cityToggle').on('click', function(){
            currentCity = cityToggle[this.id];
            data = dataToggle[this.id];
            $('#cityTitle').html(currentCity);

            map.removeLayer(markers);
            drawMap(data, currentCity);
          })

          function drawMap(data, currentCity){

            geocoder.query(currentCity, showMap);

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
      });
    });
  });
});


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

    // function findMinLat(data){
  //   var minLat = data[0]["latitude"];
  //   for (var i = 1; i < data.length; i++){
  //     var lat = data[i]["latitude"];
  //     if (lat < minLat) lat = minLat;
  //   }

  //   return minLat;
  // }

