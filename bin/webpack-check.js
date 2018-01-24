var exec = require("child_process");

var version;

try{
    version = exec.execSync("webpack -v").toString();

    if(version.split(".")[0].trim() != "3"){
        var p = exec.exec("npm install webpack -g");
        p.stderr.once("data",function(){
            console.log("An error occured");
            console.log("Run npm install webpack -g to fix else wjs won't work");
            process.exit(1);
        })
    
        p.stdout.on("end",()=>{
            console.log("Installation finished");
            console.log("Run wjs -v to confirm installation");
        })
    }else{
        console.log("Installation finished");
        console.log("Run wjs -v to confirm installation");
    }
}catch(e){
    var p = exec.exec("npm install webpack -g");
    p.stderr.once("data",function(){
        console.log("An error occured");
        console.log("Run npm install webpack -g to fix else wjs won't work");
        process.exit(1);
    })

    p.stdout.on("end",()=>{
        console.log("Installation finished");
        console.log("Run wjs -v to confirm installation");
    })
}