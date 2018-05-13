export class Photo {
    constructor() {
        this.mediaInput = document.createElement("input");
        this.mediaInput.type = "file";
        this.mediaInput.accept = "image/*;capture=camera";
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