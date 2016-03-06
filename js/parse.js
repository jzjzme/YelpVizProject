d3.json("/yelp_data/business.json", function(data){
	console.log(data[2]);
/**	for (var i = 0; i < data.length; i++){
    var row = data[i];
    if (row.state == "PA"){
      console.log(data[i]);
    }
  }**/
});
