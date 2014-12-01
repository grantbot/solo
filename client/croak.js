//Alchemy API Stuff//////////////
var img_url = 'https://lh5.googleusercontent.com/-84rBOdQKfvs/AAAAAAAAAAI/AAAAAAAAAAA/irm3HR6_mio/photo.jpg';

var api_key = '02317f2c3b6118cfb29adc7549a46dced22f1e45'
var base_url = 'http://access.alchemyapi.com/calls'

var analyze = function (endpoint, params, callback) {
  var urlKVPairs = [];
  var reqParams = "";
  var reqBody = "";

  var params = {
    'apikey': api_key,
    'outputMode': 'json'
  }

  //Build the API options into the URL (for upload) or body
  Object.keys(params).forEach(function(key) {
    urlKVPairs.push(key + '=' + encodeURIComponent(params[key]));
  });

  reqBody = urlKVPairs.join('&');

  var opts = {
    method: "POST",
    path: base_url + endpoint + reqParams,
  };

  $.ajax({
    url: opts.path,
    type: 'POST', 
    dataType: 'JSON', 
    data: img_url,
    success: function(data) {console.log(data)},
    error: function(err) {console.log(err)}
  });
};

analyze('/url/URLGetRankedImageFaceTags');





//Photobooth Stuff//////////////


var errorCallback = function(e) {
  console.log('Reeeejected!', e);
};

navigator.getUserMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

var video = document.querySelector('video');
video.addEventListener('click', snapshot, false);
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

if (navigator.getUserMedia) {

  navigator.getUserMedia({video: true, audio: false}, function(localMediaStream) {
    video.src = window.URL.createObjectURL(localMediaStream);

    video.onloadedmetadata = function(e) {
      //Loaded! Do some stuff!
    };
  }, errorCallback);
}


function snapshot() {
  ctx.drawImage(video, 0, 0);
  // "image/webp" works in Chrome.
  // Other browsers will fall back to image/png.
  document.querySelector('img').src = canvas.toDataURL('image/webp');
}
