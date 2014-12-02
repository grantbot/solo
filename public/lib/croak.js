//Photobooth Stuff//////////////
console.log("HEE")
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

  var img_url = canvas.toDataURL('image/webp')
  console.log(img_url);
  document.querySelector('img').src = img_url;

  $.post("/cam", img_url, function() {
    console.log("POST")
  })
}

