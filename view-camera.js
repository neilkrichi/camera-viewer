let cameras = [];
let camId = 0;
let currentStream = null;

document.addEventListener('readystatechange', (event) => {

	if(document.readyState === 'complete') {

		const video = document.querySelector('video');

		function successCallback(stream) {
		  currentStream = stream;
		  video.srcObject = stream;
		  video.play();
			if(location.href.includes('&debug')) {
				console.log(`stream: ${stream}`);
			}
		}

		function errorCallback(error) {
			window.alert('Error: ', error);
		}

		navigator.mediaDevices.getUserMedia({ audio: false, video: true })
		  .then(successCallback)
		  .catch(errorCallback);

		if('mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices) {
			if(navigator.mediaDevices.enumerateDevices) {
				navigator.mediaDevices.enumerateDevices().then(media_devices => {
					media_devices.forEach(media_device => {
						if(location.href.includes('&debug')) {
							console.log(media_device);
						}
				    if(media_device.kind === 'videoinput') {
					   	cameras = cameras.concat(media_device.deviceId);
						}
					})
		    })
		  }
		}

		var timeout;
		var lastTap = 0;

		video.addEventListener('touchend', function(event) {
			var currentTime = new Date().getTime();
			var tapLength = currentTime - lastTap;
			clearTimeout(timeout);
			if (tapLength < 500 && tapLength > 0) {
				console.log('Double Tap!');
				event.preventDefault();
			} else {
				timeout = setTimeout(function() {
					if(location.href.includes('&debug')) {
						console.log('Time out!');
						console.log('cameras:', cameras);
						console.log(camId);
						console.log(currentStream);
					}
					clearTimeout(timeout);
				}, 500);
			}
			lastTap = currentTime;
		});
		

		video.addEventListener('dblclick',event => {
			if(location.href.includes('&debug')) {
				console.log('clicked on video');
				console.log(cameras);
				console.log(camId);
				console.log(currentStream);
			}
			if((camId + 1) < cameras.length) {
				camId = camId +1;
			} else {
				camId = 0;
			}
			if(cameras.length > 1) {
				if(navigator.mediaDevices || navigator.mediaDevices.enumerateDevices) {
					currentStream.getTracks().forEach(track => {
						track.stop();
  				});
					video.srcObject = null;
					navigator.mediaDevices.getUserMedia({
						audio: false,
						video: {
								deviceId: {
									exact: cameras[camId]
								}
							}
					}).then(successCallback).catch(errorCallback);
				}
			}
		});

	}

});
