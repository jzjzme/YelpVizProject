
d3.csv("../dataset/ptbusiness.csv", function(err, data) {
  if (err) throw error;

  //getAvgStarByArea(data, 40.35761, 40.3922071, -80.070898, -80.05998);
  var map = drawMap(data);
  var neighborhoodObj = getRangeOfNeighborhoods(data);
  drawCircles(data, neighborhoodObj, map);

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

  return avgStars;
}

function getRangeOfNeighborhoods(data){

  var neighborhood = {};
  var minLat = Number(data[0]["latitude"]);
  var maxLat = minLat;
  var minLong =  Number(data[0]["longitude"]);
  var maxLong = minLong;

  for (var i = 1; i < data.length; i++){
    var name = data[i]["neighborhoods"];
    name = name.substring(2, name.length - 1);

    //if neighborhood exists
    if (!neighborhood[name]){
      neighborhood[name] = [minLat, maxLat, minLong, maxLong];
    } 
    else {
      var currentMinLat = Number(data[i]["latitude"]);
      var previousMinLat = neighborhood[name][0];
      if (currentMinLat < previousMinLat) {
        neighborhood[name][0] = currentMinLat;
      }

      var currentMaxLat = Number(data[i]["latitude"]);
      var previousMaxLat = neighborhood[name][1];
      if (currentMaxLat > previousMaxLat) {
        neighborhood[name][1] = currentMaxLat;
      }

      var currentMinLong = Number(data[i]["longitude"]);
      var previousMinLong = neighborhood[name][2];
      if (currentMinLong < previousMinLong) {
        neighborhood[name][2] = currentMinLong;
      }

      var currentMaxLong = Number(data[i]["longitude"]);
      var previousMaxLong = neighborhood[name][3];
      if (currentMaxLong > previousMaxLong) {
        neighborhood[name][3] = currentMaxLong;
      }
    }
  }
  //console.log(neighborhood)
  return neighborhood;
}

function drawCircles(data, neighborhoodObj, map){
    for (var name in neighborhoodObj) {
      var minLat = neighborhoodObj[name][0];
      var maxLat = neighborhoodObj[name][1];
      var minLong = neighborhoodObj[name][2];
      var maxLong = neighborhoodObj[name][3];

      var centerX = (minLat + maxLat)/2;
      var centerY = (minLong + maxLong)/2;
      var circle = L.circle([centerX, centerY], 300);
      var op = getAvgStarByArea(data, minLat, maxLat, minLong, maxLong)/5;
      //circle.setOpacity(op);
      circle.addTo(map);

    }
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
  var geocoder = L.mapbox.geocoder('mapbox.places'), map = L.mapbox.map('map', 'examples.map-h67hf2ic');

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

  for (var i = 0; i < data.length; i++){
    var lat = data[i]["latitude"];
    var long = data[i]["longitude"];

    var marker = L.marker([lat, long], {
        icon: L.mapbox.marker.icon({
          'marker-color': '#CD6889',
        })
    });

    //L.circle([40, -79], 1000).addTo(map);
    //circle.setOpacity(.1);
    //circle.addTo(map);

    marker.setOpacity(.1)
    marker.addTo(map);
  }

  return map;
}