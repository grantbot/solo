var express = require('express');
var consolidate = require('consolidate');

var app = express();
var server = require('http').createServer(app);

//Create the AlchemyAPI object
var AlchemyAPI = require('./alchemyapi');
var alchemyapi = new AlchemyAPI();

// all environments
app.engine('dust',consolidate.dust);
app.set('views',__dirname + '/views');
app.set('view engine', 'dust');
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', image);

var port = process.env.PORT || 3000;
server.listen(port, function(){
	console.log('Express server listening on port ' + port);
	console.log('To view the example, point your favorite browser to: localhost:3000'); 
});

var img_url = 'https://lh5.googleusercontent.com/-84rBOdQKfvs/AAAAAAAAAAI/AAAAAAAAAAA/irm3HR6_mio/photo.jpg';
//var img_url = 'http://media.oregonlive.com/portland_impact/photo/kennethjpg-3df374ecc58aaa20.jpg';

function image(req, res) {
  var output = {};

	alchemyapi.image('url', img_url, {}, function(response) {
		output['image'] = { 
      url:img_url, 
      faceData:JSON.stringify(response.imageFaces,null,4),
      response:JSON.stringify(response,null,4), 
      results:response 
    };

    console.log(output.image.faceData);
    res.render('example', output);
	});
}
