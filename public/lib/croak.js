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
  console.log("USING CORRECT CROAK.JS FILE")
  ctx.drawImage(video, 0, 0);
  video.pause();

  share();
  //var img_url = canvas.toDataURL('image/webp', 0)
  //document.querySelector('img').src = img_url;

  //$.post("/cam", img_url, function() {
    //console.log("POST")
  //})
}

function share(){
  console.log("POSTING TO IMGUR")

    var img;
    try {
        img = canvas.toDataURL('image/webp', 0.8).split(',')[1];
    } catch(e) {
        img = canvas.toDataURL().split(',')[1];
    }

    $.ajax({
        url: 'https://api.imgur.com/3/upload.json',
        type: 'POST',
        headers: {
            Authorization: 'Client-ID e1b0a1929b21da4',
        },
        data: {
            type: 'base64',
            name: 'FACE',
            title: 'CROAKLY FACES',
            description: 'MACHINE LEARNING ON YOUR FACE',
            image: img
        },
        dataType: 'json'
    }).success(function(data) {
        var deletehash = data.data.deletehash
        var url = 'http://imgur.com/' + data.data.id + '.png';
        console.log("IMGUR URL: ", url)
        console.log("IMGUR DELETEHASH: ", deletehash)

        var data = {
          url: url,
          deletehash: deletehash
        };

        $.post("/", data, function(data) {
          console.log(data)
          //TODO: Refactor so we correctly use a templating engine
          document.open();
          document.write(data);
          document.close();
        })

        //console.log("POSTING TO SERVER")
        //$.ajax({
          //url: '/cam',
          //type: 'POST', 
          //data: {
            //url: url,
            //deletehash: deletehash
          //}
        //}).success(function(res) {
          //console.log("SHOULD RENDER NOW")
        //})

    }).error(function(error) {
      console.log(error)
    });
}
