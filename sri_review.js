

d3.csv("data/parsedreviews1.csv", function(err, data_reviews) {
  if (err) throw error;

  var businessArr;

  d3.csv("../dataset/ptbusiness.csv", function(err, data_biz) {
    if (err) throw error;

    for (var i = 0; i < 50; i++){
    	var bizid = data_reviews[i]["business_id"])

  		var PABiz = [];

  		for (var j = 0; j < 50; j++){
  			if (bizid == data_biz[i]["business_id"] &&  data_biz[i]["state"] == "PA"){
  				parsedBiz.push(data_biz[i]);
  			}
  		}
    }

    console.log(PABiz);
  });


});