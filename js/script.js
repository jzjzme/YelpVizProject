
d3.csv('data/tip_data/tip.csv', function(err, tipData){
d3.csv('data/review_data/short_reviews.csv', function(err, reviewData){
d3.csv('data/checkin_data/checkin.csv', function(err, checkinData){
d3.csv('data/user_data/new_user.csv', function(err, userData){
d3.csv("data/biz_data/WI_Business_Data.csv", function(err, dataWI) {
d3.csv("data/biz_data/AZ_Business_Data.csv", function(err, dataAZ) {
d3.csv("data/biz_data/Vegas_Biz_Data.csv", function(err, dataVegas) {
d3.csv("data/biz_data/IL_Business_Data.csv", function(err, dataIL) {
d3.csv("data/biz_data/PA_Business_Data.csv", function(err, dataPA) {
d3.csv("data/biz_data/NC_Business_Data.csv", function(err, dataNC) {
  if (err) throw error;

  //initialize map & features
  L.mapbox.accessToken = 'pk.eyJ1Ijoic3JpOTYiLCJhIjoiY2lsZ2JwaDNmMmM5ZXZubWNzdzQ1NmJ0NSJ9._NbPwArBh8O9HKpmWsHOMg';
  var geocoder = L.mapbox.geocoder('mapbox.places'),
      map = L.mapbox.map('map', 'examples.map-h67hf2ic');

  var markers;
  var featureGroup;
  var drawControl;
  var initialized = false;

  //variable initialization
  var cityToggle = ["Urbana-Champaign, IL", "Phoenix, AZ", "Madison, WI", "Pittsburgh, PA", "Charlotte, NC"];
  var dataToggle = [dataIL, dataAZ, dataWI, dataPA, dataNC];

  var userLocations =  {};
  for (var i = 0; i < cityToggle.length; i++){
    var city = cityToggle[i];
    var state = city.substring(city.length-2, city.length);
    userLocations[state] = {};
  }
  var userTipPathObj = {};
  var indexOfCity = 3;
  var currentCity = cityToggle[indexOfCity];
  var data = dataToggle[indexOfCity];
  $('#cityTitle').html(currentCity);

  /* INITIAL FUNCTION CALLS */
  drawMap(data, currentCity);
  buildUserLocationsObj();
  var topUsers = getTopUsersByCity();
  showTop(topUsers, "user_id");
  var topBusinesses = getTopBusinesses();

  var ratingTimeObj = {};
  var ratingPersonalityObj = {};
  analyzeRating(ratingTimeObj, ratingPersonalityObj);

  var checkinDataObj = {};
  getCheckinData(checkinDataObj);

  //console.log(checkinDataObj)

  //console.log(reviewData[0]);
  var modalBusinessId;

  /* JQUERY FUNCTIONS */
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
    $(".citySelected").removeClass("citySelected");
    $(this).addClass("citySelected")
    indexOfCity = this.id;
    currentCity = cityToggle[indexOfCity];
    data = dataToggle[indexOfCity];

    $('#avgRatingForSelection').html('');
    map.removeLayer(markers);
    drawMap(data, currentCity);
    topUsers = getTopUsersByCity();
    $("#topUsers").empty();
    //showTopUsers(topUsers);
    showTop(topUsers, "user_")
  })

  $('#topUsers > li').on('click', function(){
    $(".selectedUser").removeClass("selectedUser");
    $(this).addClass("selectedUser");

    //console.log(this);

    $('#avgRatingForSelection').html('');
    map.removeLayer(markers);
    showTipLocationAnimation(this.id, userTipPathObj);
  })

  $('#selectTopBiz').on('click', function(){
    $("#topUsers").empty();
    topBusinesses = getTopBusinesses();
    showTop(topBusinesses, "business_id");
    //console.log(topBusinesses)
    addSlideShowToMap(topBusinesses);
  })

  $('#selectTopUsers').on('click', function(){
    $("#topUsers").empty();
    topUsers = getTopUsersByCity();
    showTop(topUsers, "user_id");
  })

  $('#close').on('click', function(){
    $('#businessModal').hide();
  })

  /* DATA ANALYSIS FUNCTIONS */
  function drawMap(data, currentCity){

    geocoder.query(currentCity, showMap);

    function showMap(err, data) {
        // The geocoder can return an area, like a city, or a
        // point, like an address. Here we handle both cases,
        // by fitting the map bounds to an area or zooming to a point.
        if (data.lbounds) {
            map.fitBounds(data.lbounds);
        } else if (data.latlng) {
            map.setView([data.latlng[0], data.latlng[1]], 20);
        }
    }

    markers = new L.MarkerClusterGroup({
      maxClusterradius:1
    });

    for (var i = 0; i < data.length; i++) {
        var lat = data[i]["latitude"];
        var long = data[i]["longitude"];

        var title = data[i]["name"] + " - " + data[i]["stars"] + " Stars";
        var marker = L.marker(new L.LatLng(lat, long), {
            icon: L.mapbox.marker.icon({'marker-color': '0044FF'}),
            title: title
        });
        marker.bindPopup(title);
        markers.addLayer(marker);
    }
    map.addLayer(markers);

    featureGroup = L.featureGroup().addTo(map);

    drawControl = new L.Control.Draw({
      edit: {
        featureGroup: featureGroup
      },
      draw: {
        polygon: false,
        polyline: false,
        rectangle: true,
        circle: false,
        marker: false
      }
    });

    if (!initialized){
      drawControl.addTo(map);
      initialized = true;
    }

    map.on('draw:created', showPolygonArea);
    map.on('draw:edited', showPolygonAreaEdited);

    function showPolygonAreaEdited(e) {
      e.layers.eachLayer(function(layer) {
        showPolygonArea({ layer: layer });
      });
    }

    function showPolygonArea(e) {
      var minLat = e.layer._latlngs[0]["lat"];
      var maxLat = e.layer._latlngs[1]["lat"];
      var minLong = e.layer._latlngs[1]["lng"];
      var maxLong = e.layer._latlngs[2]["lng"];

      var avgStars = getAvgStarByArea(data, minLat, maxLat, minLong, maxLong);

      $('#showAvg').html('Average Rating: ' + avgStars.toFixed(2));

      featureGroup.clearLayers();
      featureGroup.addLayer(e.layer);

      e.layer.bindPopup((LGeo.area(e.layer) / 1000000).toFixed(2) + ' km<sup>2</sup>');
      e.layer.openPopup();
    }

    //addSlideShowToMap();
  }

  function addSlideShowToMap(topBusinesses){

    map.removeLayer(markers);

    geocoder.query(currentCity, showMap);

    function showMap(err, data) {
        if (data.lbounds) {
            map.fitBounds(data.lbounds);
        } else if (data.latlng) {
            map.setView([data.latlng[0], data.latlng[1]], 15);
        }
    }

    var data = topBusinesses;

    var myLayer = L.mapbox.featureLayer().addTo(map);

    var geoJson = [];
    for (var i = 0; i < data.length; i++){
      var lat = Number(data[i]["latitude"]);
      var lng = Number(data[i]["longitude"]);
      var name = data[i]["name"];
      var biz_id = data[i]["business_id"];

      if (ratingPersonalityObj[biz_id] == undefined){
        ratingPersonalityObj[biz_id] = {
          'cool': 100,
          'funny': 100,
          'useful': 100
        }
      }

      var obj = {
          type: 'Feature',
          "geometry": { "type": "Point", "coordinates": [lng, lat]},
          "properties": {
              'title': name,
              'marker-color': '#3c4e5a',
              'marker-symbol': 'restaurant',
              'marker-size': 'large',

              // Store the image url and caption in an array.
              'images': [
                ['http://i.imgur.com/O6QEpBs.jpg','this is slide 1'],
                ['http://i.imgur.com/O6QEpBs.jpg','this is slide 2'],
                ['http://i.imgur.com/O6QEpBs.jpg','this is slide 3']
              ],
              'personalities': {
                'cool': ratingPersonalityObj[biz_id]["cool"],
                'funny': ratingPersonalityObj[biz_id]["funny"],
                'useful': ratingPersonalityObj[biz_id]["useful"]
              },
              'business_id': biz_id
          }
      };

      geoJson.push(obj);
    }

    myLayer.on('layeradd', function(e) {
        var marker = e.layer;
        var feature = marker.feature;
        var images = feature.properties.images
        var slideshowContent = '';
    
        marker.on('click', function(e){

          var feature = marker.feature;

          var cool = feature.properties.personalities.cool;
          var funny = feature.properties.personalities.funny;
          var useful = feature.properties.personalities.useful;

          modalBusinessId = feature.properties.business_id;

          $('#businessModal').fadeTo(.2, 1.0, function(){
            $('#bizTitle').html(feature.properties.title);
          })

          $('#pieChart').empty();
          $('#myChart').empty();
          $('#myCheckin').empty();

          showPieChart(cool, funny, useful);
          showLineGraph();
          showCheckinData();
        })
    });

    // Add features to the map
    myLayer.setGeoJSON(geoJson); 
  }

  function showPieChart(cool, funny, useful){
    var pie = new d3pie("pieChart", {
      "header": {
        "title": {
          "text": "",
          "color": "#c02323",
          "fontSize": 15,
          "font": "open sans"
        },
        "subtitle": {
          "color": "#999999",
          "fontSize": 10,
          "font": "open sans"
        },
        "titleSubtitlePadding": 9
      },
      "footer": {
        "color": "#999999",
        "fontSize": 10,
        "font": "open sans",
        "location": "bottom-left"
      },
      "size": {
        "canvasWidth": 300,
        "pieInnerRadius": "54%",
        "pieOuterRadius": "80%"
      },
      "data": {
        "sortOrder": "value-desc",
        "content": [
          {
            "label": "Cool Vote",
            "value": cool,
            "color": "#3c96d0"
          },
          {
            "label": "Funny Vote",
            "value": funny,
            "color": "#6affce"
          },
          {
            "label": "Useful Vote",
            "value": useful,
            "color": "#5e1fa6"
          }
        ]
      },
      "labels": {
        "outer": {
          "pieDistance": 32
        },
        "inner": {
          "hideWhenLessThanPercentage": 0
        },
        "mainLabel": {
          "fontSize": 11
        },
        "percentage": {
          "color": "#ffffff",
          "decimalPlaces": 0
        },
        "value": {
          "color": "#adadad",
          "fontSize": 11
        },
        "lines": {
          "enabled": true
        },
        "truncation": {
          "enabled": true
        }
      },
      "effects": {
        "pullOutSegmentOnClick": {
          "effect": "linear",
          "speed": 400,
          "size": 8
        }
      },
      "misc": {
        "gradient": {
          "enabled": true,
          "percentage": 100
        }
      },
      "callbacks": {}
    });
  }

  function showLineGraph(){
    for (var i = 1; i < 13; i++){
      if (ratingTimeObj[modalBusinessId][i] == undefined){
        ratingTimeObj[modalBusinessId][i] = 0;
      }
    }
    console.log("am i here")
    //console.log(ratingTimeObj[modalBusinessId]);

    var temp = [];
    for (var i = 1; i < 13; i++){
      temp.push(ratingTimeObj[modalBusinessId][i][0]);
    }

    var data = {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novemeber", "December"],
        datasets: [
            {
                label: "Ratings by Month",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#c41200",
                pointHighlightFill: "#edb7b2",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: temp
            }
        ]
    };
    this.div = document.getElementById('myChart');
    this.div.style.backgroundColor = 'white';
    this.div.style.width = '400px';
    this.div.style.height = '200px';
    this.chartCanvas = document.createElement('canvas');
    this.div.appendChild(this.chartCanvas);
    this.chartCanvas.style.height = '200px';
    this.chartCanvas.style.width = '400px';
    this.chartCanvas.width = 400;
    this.chartCanvas.height = 200;
    this.ctx = this.chartCanvas.getContext('2d');

    //This will break it
    //this.div.style.display = 'none';
    this.chart = new Chart(this.ctx).Line(data);
    this.div.style.display = 'block';

    setTimeout(function(){
        this.div.style.display = 'block';
    }.bind(this), 1000);
  }

  function showCheckinData(){

    var dayCounts = [0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < 7; i++){
      for (var j = 0; j < 24; j++){
        dayCounts[i] += Number(checkinDataObj[modalBusinessId][i][j]);
      }
    }

    var data = {
        labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        datasets: [{
                label: "Checkins by Day of Week",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#c41200",
                pointHighlightFill: "#edb7b2",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: dayCounts
            }]
    };

    this.div = document.getElementById('myCheckin');
    this.div.style.backgroundColor = 'white';
    this.div.style.width = '400px';
    this.div.style.height = '200px';
    this.chartCanvas = document.createElement('canvas');
    this.div.appendChild(this.chartCanvas);
    this.chartCanvas.style.height = '200px';
    this.chartCanvas.style.width = '400px';
    this.chartCanvas.width = 400;
    this.chartCanvas.height = 200;
    this.ctx = this.chartCanvas.getContext('2d');

    //This will break it
    //this.div.style.display = 'none';
    this.chart = new Chart(this.ctx).Bar(data);
    this.div.style.display = 'block';

    setTimeout(function(){
        this.div.style.display = 'block';
    }.bind(this), 1000);
  }

  function showTipLocationAnimation(user_id, userTipPathObj){

    geocoder.query(currentCity, showMap);

    function showMap(err, data) {
        if (data.lbounds) {
            map.fitBounds(data.lbounds);
        } else if (data.latlng) {
            map.setView([data.latlng[0], data.latlng[1]], 15);
        }
    }

    for (var i = 0; i < userTipPathObj[user_id].length; i++) {
        var lat = userTipPathObj[user_id][i]["lat"];
        var long = userTipPathObj[user_id][i]["long"];
        var title = userTipPathObj[user_id][i]["text"];

        var marker = L.marker(new L.LatLng(lat, long), {
            icon: L.mapbox.marker.icon({'marker-color': '0044FF'}),
            title: title
        });

        marker.bindPopup(title);
        map.addLayer(marker);
    }

    animateTipLocations(userTipPathObj[user_id])
  }

  function animateTipLocations(userTips){
    var times = [];
    for (var i = 0; i < userTips.length; i++){
      times.push(new Date(userTips[i]["date"]).getTime());
    }

    var path = [];
    while (times.length > 0){
      var ind1 = times.indexOf(Math.min.apply(Math, times));
      times.splice(ind1, 1);
      path.push([Number(userTips[ind1]["lat"]), Number(userTips[ind1]["long"])  ])
    }

    var marker = L.marker(path[0], {
        icon: L.mapbox.marker.icon({
          'marker-color': '#f86767'
        })
    });

    var t = 0;
    var ind = 0;
    var timer = window.setInterval(function() {
        var first = path[ind];
        var second = path[ind+1];
        marker.setLatLng(L.latLng(
          first[0] + t*(second[0]-first[0])/10,
          first[1] + t*(second[1]-first[1])/10));
        t += 1;
        var m = marker.getLatLng();
        if (m.lat == second[0] && m.lng == second[1]){
            t = 0;
            ind++;
            if (ind > path.length-2) clearInterval(timer);
        }
    }, 50);

    marker.addTo(map);
  }

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

  function buildUserLocationsObj(){
    for (var i = 0; i < 10000; i++){
      var biz_id = tipData[i]["business_id"];
      var user_id = tipData[i]["user_id"];
      var date_id = tipData[i]["date"];
      var text_id = tipData[i]["text"]; //this is the actual tips
      var businessFound = null;
      var index = 0;

      while(index < dataToggle.length && !businessFound){
        businessFound = findBusinessStateFromId(biz_id, dataToggle[index]);
        index++;
      }

      var state;
      if (businessFound){
        buildPathObj(user_id, businessFound["latitude"], businessFound["longitude"], date_id , text_id);

        var city = cityToggle[index-1];
        state = city.substring(city.length-2, city.length);

        if (userLocations[state][user_id] == undefined){
          userLocations[state][user_id] = 1;
        }
        else {
          userLocations[state][user_id]++;
        }
      }
    }
  }

  function buildPathObj(user_id, lat, long, date, text){
    if (userTipPathObj[user_id] == undefined){
      userTipPathObj[user_id] = [];
      userTipPathObj[user_id].push({"lat": lat, "long": long, "date": date, "text": text});
    }
    else {
      userTipPathObj[user_id].push({"lat": lat, "long": long, "date": date, "text": text});
    }
  }

  function getTopBusinesses(){
    var temp = [];
    var best_biz = [];
    var biz_d = dataToggle[indexOfCity]

    for (var i =0; i < biz_d.length; i++){
      temp.push(Number(biz_d[i]['review_count']));
    }

    for (var i = 0; i < 10; i++){
      var ind1 = temp.indexOf(Math.max.apply(Math, temp));
      best_biz.push(biz_d[ind1]);
      temp.splice(ind1, 1);
    }
    
    return best_biz;
  }

  function getTopUsersByCity(){
    var topUsersInEachCity = [];
    var temp = [];

    for (var key in userLocations){
      //console.log(key)
      var list = userLocations[key];
      var keysSorted = Object.keys(list).sort(function(a,b){return list[b]-list[a]});
      for (var i = 0; i < 10; i++){
        temp[i] = findUserFromId(keysSorted[i], userData);
      }
      topUsersInEachCity.push(temp);
      temp = [];
    }

    return topUsersInEachCity[indexOfCity];
  }

  function findBusinessStateFromId(biz_id, businessData){
    for(var i = 0; i < businessData.length; i++){
      if (biz_id == businessData[i]["business_id"]){
        return businessData[i];
      }
    }

    return null;
  }

  function findUserFromId(user_id, userData){
    for (var i = 0; i < userData.length; i++){
      if (user_id == userData[i]["user_id"]){
        return userData[i];
      }
    }

    return [];
  }

  function showTop(arr, id){
    for (var i = 0; i < arr.length; i++){
      var node = document.createElement("LI");
      node.setAttribute("id", arr[i][id]);
      node.setAttribute("class", "tableElement");
      var textnode = document.createTextNode(i+1 + " " + arr[i]["name"]);
      node.appendChild(textnode);
      document.getElementById("topUsers").appendChild(node);
    }
  }

  function analyzeRating(ratingTimeObj, ratingPersonalityObj){
    for (var i = 0; i < reviewData.length; i++){
      var biz_id = reviewData[i]["business_id"];
      var date = reviewData[i]["date"];
      if (date[1] == '/'){
        date = reviewData[i]["date"].substring(0, 1)
      } else {
        date = reviewData[i]["date"].substring(0, 2)
      }

      var stars = Number(reviewData[i]["stars"]);

      var cool = Number(reviewData[i]["votes_cool"])
      var funny = Number(reviewData[i]["votes_funny"])
      var useful = Number(reviewData[i]["votes_useful"])

      //business was never reached
      if (ratingTimeObj[biz_id] == undefined){
        ratingTimeObj[biz_id] = {};
        ratingPersonalityObj[biz_id] = {
          cool: 0,
          funny: 0,
          useful: 0
        };
      }

      if (ratingTimeObj[biz_id][date] == undefined){
        ratingTimeObj[biz_id][date] = [stars, 1];
      }
      else {
        var count = ratingTimeObj[biz_id][date][1] + 1;
        var avgStars = (ratingTimeObj[biz_id][date][0]*(count-1) + stars)/count;
        ratingTimeObj[biz_id][date] = [Number(avgStars.toFixed(2)), count]
      }

      ratingPersonalityObj[biz_id]["cool"] += cool;
      ratingPersonalityObj[biz_id]["funny"] += funny;
      ratingPersonalityObj[biz_id]["useful"] += useful;
    }

    //console.log(ratingTimeObj);
  }

  function getCheckinData(checkinDataObj){
    for (var i = 0; i < checkinData.length; i++){
      var biz_id = checkinData[i]["business_id"];
      checkinDataObj[biz_id] = {};
      for (var key in checkinData[i]){
        if (key != 'type' && key != "business_id"){
          var day = key[key.length-1];
          var hour = key.substring(key.indexOf('.')+1, key.indexOf('-'))
          var numCheckins = checkinData[i][key];
          if (checkinDataObj[biz_id][day] == undefined){
            checkinDataObj[biz_id][day] = {};
          }
          checkinDataObj[biz_id][day][hour] = numCheckins;
        }
      } 
    }
    //console.log("hello")
    console.log(checkinDataObj);
  }

});
});
});
});
});
});
});
});
});
});



// AZ. 5kJYTUtFUJT24dWNs6eW8w
// IL. TIPAxQKKs058vSURbfoBwA
// NV. JEvkfVPf_DuhX-ntE5L6bQ
// PA. QcGi0cDzzGLb3LmiI33Psg
// WI. lC0KGXmIhyjzghBUlVnkhQ
