import { $ } from "./web";
// var video = document.getElementById('camera');

// navigator.webkitGetUserMedia({video: true},
//   function(stream) {
//     video.src = URL.createObjectURL(stream);
//   },
//   function() {
//     alert('could not connect stream');
//   }
// );

// var b = document.getElementById("button");

// b.onclick = function(){
//   alert("Click")
//   var canvas = document.getElementById("canvas");
//   var photo = document.getElementById("photo");
//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;
//   canvas.getContext("2d").drawImage(video,0,0);
//   photo.src = canvas.toDataURL("image/png")
// }

class MediaEvent {
    constructor(name){
        this.name = name;
        this.callbacks = [];
    }

    registerCallback(c){
        this.callbacks.push(c);
    }
}

export class Photo {
    constructor() {
        // super();
        var randId2 = (Math.random()*Math.random())/Math.random();
        $("body").append("<video id='"+randId2+"'><video>")
        this.video = document.getElementById(randId2.toString());
        this.video.style.display = "none";
        this.cameraReady = 0;
        this.events = {};
        this.streaming = false;
        this.registerEvent("Ready");
        this.stream = undefined;
        this.flashOn = false;
        // this.flasLight = new Me
    }

    onComplete(callback){
        this.callback = callback;
    }

    enableFlash(){
        if(this.streaming){
            var videoTrack = this.stream.getVideoTracks()[0];

            try{
                videoTrack.applyConstraints({
                    advanced: [{torch:true}]
                })
            }catch(e){
                throw e;
            }

            this.flashOn = true;
        }
    }

    disableFlash(){
        if(this.streaming){
            var videoTrack = this.stream.getVideoTracks()[0];
            // MediaStream.prototype.ge
            // var 
            try{
                videoTrack.applyConstraints({
                    advanced: [{torch: false}]
                })
            }catch(e){
                throw e;
            }
            
            this.flashOn = false;
        }
    }

    streamPreview(element,mode,error){
        this.video = element;
        var self = this;
        navigator.mediaDevices.getUserMedia({video: mode||true}).then(
            function(stream){
                self.streaming = true;
                self.video.srcObject = stream;
                self.stream = stream;
                // stream.getTracks()[0]
                console.log(navigator.mediaDevices.getSupportedConstraints())
                console.log(stream.getVideoTracks()[0].getCapabilities())
                self.emit("Ready");
            }
        ).catch(function(e){
            if(error){
                error(e)
            }else{
                console.error("Could not connect stream")
            }
        })
    }

    registerEvent(eventName){
        var event = new MediaEvent(eventName);
        this.events[eventName] = event;
    }

    emit(evn,eva){
        this.events[evn].callbacks.forEach(function(callback){
            callback(eva);
        })
    }

    on(evn,evc){
        this.events[evn].registerCallback(evc)
    }

    closeStream(){
        if(this.stream){
            this.stream.getTracks().forEach(function(track){
                track.stop();
            })
        }else{
            throw new Error("Stream already closed")
        }
    }

    capture(type,callback){
        var self = this;
        // this.mediaInput.click()

        // this.mediaInput.onchange = function(){
        //     if(callback){
        //         callback(self.mediaInput.files[0])
        //     }else{
        //         alert(self.mediaInput.files[0])
        //     }
        // }
        if(!this.streaming){
            this.streamPreview(this.video)
        }
        // var i = setInterval(function(){
        //     console.log(self.cameraReady)
        //     if(self.cameraReady === 1){
        //         clearInterval(i);
        //         setTimeout(function(){
        //             var randId = (Math.random()*Math.random())/Math.random();
        //             $("body").append("<canvas id='"+randId+"'><canvas>")
        //             var canvas = document.getElementById(randId.toString());
        //             canvas.style.display = "none";
        //             canvas.width = self.video.videoWidth;
        //             canvas.height = self.video.videoHeight;
        //             canvas.getContext("2d").drawImage(self.video,0,0);
        //             callback(canvas.toDataURL("image/"+type));
        //         },100)
        //         self.video.remove()
        //     }
        // }, 100)

        // alert("Capturing")
        setTimeout(function(){
            var randId = (Math.random()*Math.random())/Math.random();
            $("body").append("<canvas id='"+randId+"'><canvas>")
            var canvas = document.getElementById(randId.toString());
            canvas.style.display = "none";
            canvas.width = self.video.videoWidth;
            canvas.height = self.video.videoHeight;
            canvas.getContext("2d").drawImage(self.video,0,0);
            callback(canvas.toDataURL("image/"+type));
        },1000)
    }
}

export class Video {
    constructor() {
        this.mediaInput = document.createElement("input");
        this.mediaInput.type = "file";
        this.mediaInput.accept = "video/*;capture=camcorder";
    }

    onComplete(callback){
        this.callback = callback;
    }

    capture(){
        var self = this;
        this.mediaInput.click()

        this.mediaInput.onchange = function(){
            if(self.callback){
                self.callback(self.mediaInput.files[0])
            }else{
                alert(self.mediaInput.files[0])
            }
        }
    }
}

export class Audio {
    constructor() {
        this.mediaInput = document.createElement("input");
        this.mediaInput.type = "file";
        this.mediaInput.accept = "audio/*;capture=microphone";
    }

    onComplete(callback){
        this.callback = callback;
    }

    capture(){
        var self = this;
        this.mediaInput.click()

        this.mediaInput.onchange = function(){
            if(self.callback){
                self.callback(self.mediaInput.files[0])
            }else{
                alert(self.mediaInput.files[0])
            }
        }
    }
}