console.log("inside this file")

d3.csv("../dataset/ptbusiness.csv", function(err, data) {
  if (err) throw error;
  console.log("inside callback")
  var bizid = 0;
  for (var i = 0; i < 20; i++){
  	console.log(data[i]["business_id"])
  }

  // d3.csv("../dataset/ptbusiness.csv", function(err, data) {
  //   if (err) throw error;

    

  // });

});