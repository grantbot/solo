var http = require('http');
var fs = require('fs');

//Make the class available
exports = module.exports = AlchemyAPI;

/** 
  * Checks if file is called directly, and then writes the API key to api_key.txt if it's included in the args 
  *
  * Note: if you don't have an API key, register for one at: http://www.alchemyapi.com/api/register.html
  *
  * INPUT:
  * Your API Key (sent as a command line argument)
  *
  * OUTPUT:
  * none
*/  
if (require.main === module) {
	//file was called directly from command line to set the key
	if (process.argv[2]) {
		console.log('Args: ' + process.argv[2]);
		fs.writeFile(__dirname + '/api_key.txt',process.argv[2], function(err) {
			if (err) {
				console.log('Error, unable to write key file: ' + err);
				process.exit(1);
			} else {
				console.log('AlchemyAPI key: ' + process.argv[2] + ' successfully written to api_key.txt');
				console.log('You are now ready to start using AlchemyAPI. For an example, run: node app.js');
				process.exit(0);
			}
		});
	} else {
		console.log('Are you trying to set the key? Make sure to use: node alchemyapi.js YOUR_KEY_HERE');
		process.exit(1);
	}
}



function AlchemyAPI() {

	//Load the key from api_key.txt
	try {
		key = fs.readFileSync(__dirname + '/api_key.txt').toString().trim();
	}
	catch(err) {
		//Create the file
		fs.openSync(__dirname + '/api_key.txt', 'w');
		console.log('API key not detected in api_key.txt, please run: node alchemyapi.js YOUR_KEY_HERE');
		console.log('If you do not have a key, register for one at: http://www.alchemyapi.com/api/register.html');
		process.exit(1);
	}
	
	//Make sure the key formating looks good
	if (key.length != 40) {
		console.log('The API key in api_key.txt does not appear to be valid. Make sure to run: node alchemyapi.js YOUR_KEY_HERE');
		console.log('If you do not have a key, register for one at: http://www.alchemyapi.com/api/register.html');
		process.exit(1);
	}

	//Set the key
	this.apikey = key;


	this.analyze = function (endpoint, params, sfile, callback) {
    var urlKVPairs = [];
    var reqParams = "";
    var reqBody = "";
    var upload = false;

		//Add the API key and set the output mode to JSON
		params['apikey'] = this.apikey;
		params['outputMode'] = 'json';

    // This is an upload if there is a file for streaming
    if (typeof sfile === "string") {
      params['imagePostMode'] = 'raw';
      upload = true;
    } else { // not an upload, sfile param must be the callback
      callback = sfile;
    }

		//Build the API options into the URL (for upload) or body
    Object.keys(params).forEach(function(key) {
      urlKVPairs.push(key + '=' + encodeURIComponent(params[key]));
    });
    if (upload) {
      reqParams = "?" + urlKVPairs.join('&');
    } else {
      reqBody = urlKVPairs.join('&');
    }

    //Build the HTTP request options
    var opts = {
      method: "POST",
      hostname: AlchemyAPI.HOST,
      path: AlchemyAPI.BASE_URL + endpoint + reqParams,
    };
    if (upload) {
      opts['headers'] = {'Content-Length': fs.statSync(sfile).size};
    } else {
      opts['headers'] = {'Content-Length': reqBody.length};
    }

    var postReq = http.request(opts, function (res) {
      var response = "";
      res.setEncoding('utf8');
      res.on('data', function (chunk) { response += chunk; });
      res.on('end', function () { callback(JSON.parse(response)); });
      res.on('error', function (err) {
        callback({ status:'ERROR', statusInfo: err });
      });
    });

    // Execute the call to the API
    if (upload) {
      fs.createReadStream(sfile).pipe(postReq);
    } else {
      postReq.write(reqBody);
      postReq.end();
    }
  };

}; // end AlchemyAPI


//Add the static variables
AlchemyAPI.HOST = 'access.alchemyapi.com'; 
AlchemyAPI.BASE_URL = '/calls'; 

//Setup the endpoints
AlchemyAPI.ENDPOINTS = {};
AlchemyAPI.ENDPOINTS['face'] = {};
AlchemyAPI.ENDPOINTS['face']['url'] = '/url/URLGetRankedImageFaceTags';

/**
  *	Extracts images from a URL.
  *	
  *	INPUT:
  *	flavor -> which version of the call (currently, only 'url' is supported)
  *	data -> the data to analyze, either the the url or html code.
  *	options -> various parameters that can be used to adjust how the API works, see below for more info on the available options.
  *	callback -> the callback function for this async function	
  *	
  *	Available Options:
  *	extractMode -> trust-metadata: less CPU-intensive and less accurate, always-infer: more CPU-intensive and more accurate
  *
  *	OUTPUT:
  *	The response, already converted from JSON to a Javascript object. 
*/
AlchemyAPI.prototype.image = function(flavor, data, options, callback) {
	options = options || {}

	//Add the data to the options and analyze
	options[flavor] = data;
	this.analyze(AlchemyAPI.ENDPOINTS['face'][flavor], options, callback);
};









//Normally above/////////////////////

/**
 *	HTTP Request wrapper that is called by the endpoint functions. This function is not intended to be called through an external interface. 
 *	It makes the call, then converts the returned JSON string into a Javascript object. 
 *	
 *	INPUT:
 *	url -> the full URI encoded url
 *	params -> the call parameters, both required and optional
 *	sfile -> a file to stream if this is a file upload (optional)
 *	callback -> the callback function
 *
 *	OUTPUT:
 *	The response, already converted from JSON to a Javascript object. 
 */
/*
   this.analyze = function (endpoint, params, sfile, callback) {
// This is an upload if there is a file for streaming
if (typeof sfile === "string") {
return this.analyze_upload(endpoint, params, sfile, callback);
} else {
callback = sfile;
}

//Insert the base url
var url = AlchemyAPI.BASE_URL + endpoint;

//Add the API key and set the output mode to JSON
params['apikey'] = this.apikey;
params['outputMode'] = 'json';
if ("image" in params) {
params['imagePostMode'] = 'not-raw';
}

//Fire off the request
request.post(url, {form:params}, function(error, response, body) {
if (error) throw new Error(error);
if (response.statusCode == 200) {
callback(JSON.parse(body));
} else {
callback({ status:'ERROR', statusInfo:'invalid server response' });
}
});
}
*/

/**
 *	HTTP Uploader
 *	It makes the call, then converts the returned JSON string into a Javascript object. 
 *	
 *	INPUT:
 *	url -> the full URI encoded url
 *	params -> the call parameters, both required and optional
 *	sfile -> a file to stream if this is a file upload (optional)
 *	callback -> the callback function
 *
 *	OUTPUT:
 *	The response, already converted from JSON to a Javascript object. 
 */


