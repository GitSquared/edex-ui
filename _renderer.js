const {desktopCapturer} = require('electron');

desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
  if (error) throw error;
  window.sources = sources;
  for (let i = 0; i < sources.length; ++i) {
    if (sources[i].name === 'eDEX-UI') {
        navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sources[i].id,
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 720,
              maxHeight: 720
            }
          }
        }).then((mediaStream) => {
          let video = document.querySelector('video');
          video.srcObject = mediaStream;
          video.onloadedmetadata = () => {
            video.play();
          };
        })
        .catch((err) => { console.log(err.name + ": " + err.message); });
      return;
    }
  }
});

function handleStream (stream) {
console.log(stream);
console.log(URL.createObjectURL(stream));
  document.querySelector('video').src = URL.createObjectURL(stream);
}

function handleError (e) {
  console.log(e);
}
