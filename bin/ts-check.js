var cp = require("child_process");

function Catch(f,res,rej,...args){
    try{
        f(...args);
        res();
    }catch(e){
        rej(e)
    }
}

function installTSLoader(){
    console.log("Installing loader");
    var ts = cp.exec("npm install typescript -g");

    ts.stderr.once("error",()=>{
        console.log("Failed to install loader\n\nrun 'npm install ts-loader' to manually install")
        process.exit(1)
    })

    ts.stdout.on("end",()=>{
        console.log("You are ready to go")
    })
}

function getTSLoader(){
    Catch(require.resolve,()=>{
        console.log("Found loader");
        console.log("You are ready to go")
    },(err)=>{
        installTSLoader()
    },"ts-loader")
}

Catch(require.resolve,()=>{
    console.log("Found typescript")
    getTSLoader()
},(err)=>{
    console.log("Installing typescript");
    var ts = cp.exec("npm install typescript -g");

    ts.stderr.once("error",()=>{
        console.log("Failed to install typescript\n\nrun 'npm install typescript' to manually install")
    })
    
    ts.stdout.on("end",()=>{
        getTSLoader()
    })
},"typescript")