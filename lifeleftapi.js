//TODO: Refactor to use https instead of unirest
var https = require('https');
var unirest = require('unirest');

exports.lifeLeft = function(req, res, age_range, age_range_score, gender, gender_score, callback) {
  console.log("PREP FOR TIME LEFT API");
  var age = age_range.match(/\d\d/)[0];
  console.log("AGE", age);

  var birth_year = (2014 - age).toString();
  console.log("BIRTH YEAR", birth_year);

  gender = gender.toLowerCase(); 
  console.log("GENDER", gender)

  var base_path = "https://life-left.p.mashape.com/time-left"
  var param_string = "?birth=" + birth_year + "&gender=" + gender;

  //Ex: unirest.get("?birth=14+April+1991&gender=male")
  console.log("SENDING TO TIME LEFT API")
  unirest.get(base_path + param_string)
  //unirest.get('http://requestb.in/15wv0d41')
  //TODO: Put this key somewhere safe
    .header("X-Mashape-Key", "Fq0wp4sDRmmshjK9Gc9ycSIxWcYgp1SQYWHjsnxAul5pWc3o1w")
    .end(function (result) {
      callback(result);
    });
}; 
