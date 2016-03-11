



// d3.csv('data/userdata/xaa.csv', function(err, userData1){
// d3.csv('data/userdata/xab.csv', function(err, userData2){
// d3.csv('data/userdata/xac.csv', function(err, userData3){
// d3.csv('data/userdata/xad.csv', function(err, userData4){
// d3.csv('data/userdata/xae.csv', function(err, userData5){
// d3.csv('data/userdata/xaf.csv', function(err, userData6){
// d3.csv('data/userdata/xag.csv', function(err, userData7){
// d3.csv('data/userdata/xah.csv', function(err, userData8){
// d3.csv('data/userdata/xai.csv', function(err, userData9){
// d3.csv('data/userdata/xaj.csv', function(err, userData10){
// d3.csv('data/userdata/xak.csv', function(err, userData11){
// d3.csv('data/userdata/xal.csv', function(err, userData12){
// d3.csv('data/userdata/xam.csv', function(err, userData13){
// d3.csv("data/WI_Business_Data.csv", function(err, dataWI) {
// d3.csv("data/AZ_Business_Data.csv", function(err, dataAZ) {
// d3.csv("data/Vegas_Biz_Data.csv", function(err, dataVegas) {
// d3.csv("data/IL_Business_Data.csv", function(err, dataIL) {
// d3.csv("data/PA_Business_Data.csv", function(err, dataPA) {
//   if (err) throw error;

//   //initialize map & features
//   L.mapbox.accessToken = 'pk.eyJ1Ijoic3JpOTYiLCJhIjoiY2lsZ2JwaDNmMmM5ZXZubWNzdzQ1NmJ0NSJ9._NbPwArBh8O9HKpmWsHOMg';
//   var geocoder = L.mapbox.geocoder('mapbox.places'),
//       map = L.mapbox.map('map', 'examples.map-h67hf2ic');

//   var markers;
//   var featureGroup;
//   var drawControl;
//   var initialized = false;

//   //data to visualize
//   var cityToggle = ["Las Vegas, NV", "Urbana-Champaign, IL", "Phoenix, AZ", "Madison, WI", "Pittsburgh, PA"];
//   var dataToggle = [dataVegas, dataIL, dataAZ, dataWI, dataPA];
  
//   var currentCity = cityToggle[4];
//   var data = dataToggle[4];
//   $('#cityTitle').html(currentCity);

//   drawMap(data, currentCity);

//   $('#ratingFilter').on('click', function(){
//       var stars = $('#ratingInput').val();
//       var starFilterData = [];
//       var count = 0;
//       for (var i = 0; i < data.length; i++) {
//         if (data[i]["stars"] >= stars){
//           starFilterData[count] = data[i];
//           count++;
//         }
//       }

//       map.removeLayer(markers);
//       drawMap(starFilterData, currentCity);
//   });

//   $('.cityToggle').on('click', function(){
//     currentCity = cityToggle[this.id];
//     data = dataToggle[this.id];
//     $('#cityTitle').html(currentCity);

//     $('#avgRatingForSelection').html('');
//     map.removeLayer(markers);
//     drawMap(data, currentCity);
//   })

//   function drawMap(data, currentCity){

//     geocoder.query(currentCity, showMap);

//     function showMap(err, data) {
//         // The geocoder can return an area, like a city, or a
//         // point, like an address. Here we handle both cases,
//         // by fitting the map bounds to an area or zooming to a point.
//         if (data.lbounds) {
//             map.fitBounds(data.lbounds);
//         } else if (data.latlng) {
//             map.setView([data.latlng[0], data.latlng[1]], 15);
//         }
//     }

//     markers = new L.MarkerClusterGroup();

//     for (var i = 0; i < data.length; i++) {
//         var lat = data[i]["latitude"];
//         var long = data[i]["longitude"];

//         var title = data[i]["name"] + data[i]["stars"];
//         var marker = L.marker(new L.LatLng(lat, long), {
//             icon: L.mapbox.marker.icon({'marker-color': '0044FF'}),
//             title: title
//         });
//         marker.bindPopup(title);
//         markers.addLayer(marker);
//     }

//     map.addLayer(markers);

//     featureGroup = L.featureGroup().addTo(map);

//     drawControl = new L.Control.Draw({
//       edit: {
//         featureGroup: featureGroup
//       },
//       draw: {
//         polygon: false,
//         polyline: false,
//         rectangle: true,
//         circle: false,
//         marker: false
//       }
//     });

//     if (!initialized){
//       drawControl.addTo(map);
//       initialized = true;
//     }

//     map.on('draw:created', showPolygonArea);
//     map.on('draw:edited', showPolygonAreaEdited);

//     function showPolygonAreaEdited(e) {
//       e.layers.eachLayer(function(layer) {
//         showPolygonArea({ layer: layer });
//       });
//     }

//     function showPolygonArea(e) {
//       var minLat = e.layer._latlngs[0]["lat"];
//       var maxLat = e.layer._latlngs[1]["lat"];
//       var minLong = e.layer._latlngs[1]["lng"];
//       var maxLong = e.layer._latlngs[2]["lng"];

//       var avgStars = getAvgStarByArea(data, minLat, maxLat, minLong, maxLong);

//       $('#avgRatingForSelection').html(avgStars);

//       featureGroup.clearLayers();
//       featureGroup.addLayer(e.layer);

//       e.layer.bindPopup((LGeo.area(e.layer) / 1000000).toFixed(2) + ' km<sup>2</sup>');
//       e.layer.openPopup();
//     }
//   }

//   function getAvgStarByArea(data, minLat, maxLat, minLong, maxLong){
//     var avgStars;
//     var count = 0;
//     for (var i = 0; i < data.length; i++){
//       var lat = Number(data[i]["latitude"]);
//       var long = Number(data[i]["longitude"]);
//       var stars = Number(data[i]["stars"]);
//       if (lat > minLat && lat <= maxLat && long > minLong && long <= maxLong){
//         if (avgStars == null) avgStars = stars;
//         else avgStars = (avgStars*count + stars)/(count + 1);
//         count++;
//       }
//     }

//     return avgStars;
//   }      
// });
// });
// });
// });
// });
// });
// });
// });
// });
// });
// });
// });
// });
// });
// });
// });
// });
// });

var userLocations = {
  "NV": {},
  "IL": {},
  "AZ": {},
  "WI": {},
  "PA": {},
};

d3.csv('../dataset/tip.csv', function(err, tipData){
  for (var i = 0; i < tipData; i++){
    
    var biz_id = userData1[i]["business_id"];
    var businessDataArray = [dataVegas, dataIL, dataAZ, dataWI, dataPA];
    var businessFound = false;
    var index = 0;
    var biz_state = "";
    while(biz_state == "" || index == businessDataArray.length){
      biz_state = findBusinessStateFromTip(biz_id, businessDataArray[index]);
      index++;
    }

    var userDataArray = [userData1, userData2, userData3, userData4, userData5, userData6, userData6, userData7, userData8, userData9, userData10, userData11, userData12, userData13];
    var userFoundFlag = false;
    var index = 0;
    
    while(!userFoundFlag){
      foundFlag = findUserWhoTipped(userDataArray[index]);
      index++;
    }

  }
});

function findBusinessStateFromTip(biz_id, businessData){
  
}


  // function findMinLat(data){
  //   var minLat = data[0]["latitude"];
  //   for (var i = 1; i < data.length; i++){
  //     var lat = data[i]["latitude"];
  //     if (lat < minLat) lat = minLat;
  //   }

  //   return minLat;
  // }

