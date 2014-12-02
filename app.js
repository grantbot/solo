var express = require('express');
var consolidate = require('consolidate');

var app = express();
var server = require('http').createServer(app);

//Import lifeleft api function
var lifeLeft = require('./lifeleftapi.js')

//Create the AlchemyAPI object
var AlchemyAPI = require('./alchemyapi');
var alchemyapi = new AlchemyAPI();

// all environments
app.engine('dust',consolidate.dust);
app.set('views',__dirname + '/views');
app.set('view engine', 'dust');
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.get('/', image);
app.get('/life', life);

var img_url = 'https://lh5.googleusercontent.com/-84rBOdQKfvs/AAAAAAAAAAI/AAAAAAAAAAA/irm3HR6_mio/photo.jpg';
//var img_url = 'http://images.ak.instagram.com/profiles/profile_3920288_75sq_1380869624.jpg';
//var img_url = 'http://media.oregonlive.com/portland_impact/photo/kennethjpg-3df374ecc58aaa20.jpg';

function image(req, res) {
  var output = {};

	alchemyapi.image('url', img_url, {}, function(response) {
    console.log("PROCESSED URL: ", img_url);

    var age_range = response.imageFaces[0].age.ageRange;
    var age_range_score = response.imageFaces[0].age.score;
    var gender = response.imageFaces[0].gender.gender;
    var gender_score = response.imageFaces[0].gender.score;

    output['face_recog_data'] = {
      raw:response,
      data_raw:{
        url: img_url,
        age_range: age_range,
        age_range_score: age_range_score,
        gender: gender,
        gender_score: gender_score
      }
    };

    lifeLeft.lifeLeft(req, res, age_range, age_range_score, gender, gender_score, function(result) {
      console.log("TIME-LEFT REQUEST COMPLETE. TIME TO RENDER");
      console.log("TIME LEFT RESULT", result.body);

      output['time_left_data'] = {
        raw:result,
        data_raw:result.body,
        data_json:JSON.stringify(result.body,null,4), 
      }
      res.render('example', output);
    });
	});
};

function life(req, res) {

  lifeLeft.lifeLeft(req, res);

  //TODO: Use a promise here to render after http request completes
  //res.render('example', output)
}



var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express server listening on port ' + port);
  console.log('To view the example, point your favorite browser to: localhost:3000'); 
});
