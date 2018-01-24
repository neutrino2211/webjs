class FS{
    constructor(){
        this.sock = new WebSocket("ws://localhost:8888");
    }

    readFile(fname){
        var self = {};
        this.sock.onopen = ()=>{
            this.sock.send("ReadFile:-:"+fname);
        }
        this.sock.onmessage = (data)=>{
            self.oncomplete(data.data);
        }

        return self;
    }

    writeFile(fname,contents){
        var self = {};
        this.sock.onopen = ()=>{
            this.sock.send("WriteFile:-:"+fname+":-:"+contents);
        }
        this.sock.onmessage = (data)=>{
            if(data.data.startsWith("ok")){
                self.oncomplete();
            }else{
                self.oncomplete(data.data);
            }
        }

        return self;
    }

    makeDirectory(dirname){
        var self = {};
        this.sock.onopen = ()=>{
            this.sock.send("MakeFolder:-:"+dirname);
        }
        this.sock.onmessage = (data)=>{
            self.oncomplete(data.data)
        }

        return self;
    }

    getFiles(dirname){
        var self = {};
        this.sock.onopen = ()=>{
            this.sock.send("Files:-:"+dirname);
        }
        this.sock.onmessage = (data)=>{
            self.oncomplete(JSON.parse(data.data))
        }

        return self;
    }

    getFolders(dirname){
        var self = {};
        this.sock.onopen = ()=>{
            this.sock.send("Folders:-:"+dirname);
        }
        this.sock.onmessage = (data)=>{
            self.oncomplete(data.data)
        }

        return self;
    }
}

window.flame = {};
window.flame.window = {};
window.flame.FS = FS;
//-----------------------------MANIFEST PROCESSING-------------------------------
var manifest = window.document.getElementsByTagName("flame-manifest")[0];
head.style.backgroundColor = "white";
head.style.color = "black"
if(manifest.getAttribute("style:colour")){
    object.window.style.backgroundColor = manifest.getAttribute("style:colour")
    head.style.backgroundColor = manifest.getAttribute("style:colour");
}
if(manifest.getAttribute("header:colour")){
    head.style.backgroundColor = manifest.getAttribute("header:colour");
}
if(manifest.getAttribute("luanch:any")){
    window.makeProgram = programize;
    window.launchProgram = launch;
}
if(manifest.getAttribute("style:blind")){
    var v = manifest.getAttribute("style:blind");
    var e = v.split(",");
    if(e != "true"){
        e.forEach((i)=>{
            window.document.querySelectorAll(i).forEach((j)=>{
                j.style.opacity = "0.9";
                // j.style.filter = "blur(3px)"
                // alert(j.children)
                for(var i=0;i<j.children.length;i++){
                   j.children[i].style.filter = "blur(0px)"
                }
            })
        });   
    }
}
if(manifest.getAttribute("override:size")){
    var obj = {}
    var key_value_map = manifest.getAttribute("override:size").split(",");
    
    key_value_map.forEach((kvm)=>{
        var key = kvm.split("=")[0].trim();
        var value = kvm.split("=")[1].trim();
        
        obj[key] = value;
    })
    
    obj.start = function(event, ui) {
       $("iframe").css("pointer-events","none");
    }
    
    obj.stop = function(event, ui) {
        $("iframe").css("pointer-events","initial");
    }
    
    $(object.window).resizable(obj);
}
//----------------------------SET PROGRAM TITLE----------------------------------
if(manifest){
    window.makeProgram = programize;
    window.launchProgram = launch;
    // alert(window.Main)
    if(self.Then){
        self.Then(window.Main(object.args))
    }else{
        window.Main(object.args)
    }
}