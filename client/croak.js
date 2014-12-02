//Photobooth Stuff//////////////
console.log("CROAK JS IMPORTED")
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
canvas.width = 640;
canvas.height = 480;


if (navigator.getUserMedia) {

  navigator.getUserMedia({video: true, audio: false}, function(localMediaStream) {
    video.src = window.URL.createObjectURL(localMediaStream);

    video.onloadedmetadata = function(e) {
      //Loaded! Do some stuff!
    };
  }, errorCallback);
}


function snapshot() {
  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);

  var img_url = canvas.toDataURL('image/jpeg')
  console.log(img_url);
  document.querySelector('img').src = img_url;

  var data = {
    data: img_url
  }

  console.log("AJAX")
  $.ajax({
    type: "POST",
    url: "/",
    data: data,
    success: function() {console.log("NICE")},
    dataType: "application/json"
  });
}

