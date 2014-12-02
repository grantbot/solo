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
app.use(express.static(__dirname + '/public'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.get('/', layout);
app.get('/cam', image);
app.post('/cam', image);

//var img_url = "https://media.licdn.com/mpr/mpr/shrink_120_120/p/5/005/094/21a/05e8fde.jpg";
//var img_url = 'https://fbcdn-sphotos-d-a.akamaihd.net/hphotos-ak-xfa1/v/t1.0-9/483786_10201050724974586_1248485618_n.jpg?oh=11b20e552f3c14e43dcba387d62da625&oe=551171F3&__gda__=1426909692_7602f883344f4f23a201ad483ab52baf'
//var static_url = 'https://lh5.googleusercontent.com/-84rBOdQKfvs/AAAAAAAAAAI/AAAAAAAAAAA/irm3HR6_mio/photo.jpg';
//var static_url = 'http://images.ak.instagram.com/profiles/profile_3920288_75sq_1380869624.jpg';
var static_url = "https://media.licdn.com/mpr/mpr/shrink_500_500/p/6/005/08e/184/157ec24.jpg"
//var static_url = 'http://media.oregonlive.com/portland_impact/photo/kennethjpg-3df374ecc58aaa20.jpg';

function handleImage(req, res) {
  console.log("HANDLING IMAGE")
  var img_url = Object.keys(req.body)[0];
  console.log("INITIAL URL", img_url)

  var output = {};

	alchemyapi.image('image', img_url, {}, function(response) {
    //console.log("PROCESSED URL: ", Object.keys(img_url));
    console.log(response);
    if (response.imageFaces.length) {

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
    } else {
      console.log("NO IMG FOUND")
    }
	});

}
function image(req, res) {
  var output = {};
  var req_url = req.body.url;

  var img_url = req_url || static_url;

	alchemyapi.image('url', img_url, {}, function(response) {
    console.log("PROCESSED URL: ", img_url);
    console.log("INITIAL RESPONSE", response)

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

function layout(req, res) {
  var output = {};
  
  res.render('layout', output);

  //TODO: Use a promise here to render after http request completes
  //res.render('example', output)
}



var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express server listening on port ' + port);
  console.log('To view the example, point your favorite browser to: localhost:3000'); 
});
