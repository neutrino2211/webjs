#!/usr/bin/env node

//Greetings
console.log("WJS cli:")
var print = console.log;

//Declare variables
var s;
var c;
var os                 = require("os");
var fs                 = require("fs-extra");
var xml                = require("xmldom");
var cwd                = process.cwd();
var path               = require("path");
var http               = require("https");
var args               = process.argv.slice(2,process.argv.length);
var exec               = require("child_process").exec;
var utils              = require('./utils');
var chalk              = require("chalk");
var server             = require("../resources/server");
var package            = require("../package.json");
var Install            = require("./install");
var firebase           = require("firebase");
var websocket          = require("websocket");
var resize_image       = require("resize-img");
var resourcesPath      = path.join(__dirname,"../resources");
var valuesPath         = path.join(resourcesPath,"android/app/src/main/res/values");
var projectDefinitions = require("./proj-def")
var refreshMode        = "initial";
//Specify argument types

if(args.length > 0){
    var operation = args[0];
    var operand   = args[1];
}else{
    console.log(chalk.red("No arguments"))
}


global.RESOURCES_PATH = path.join(__dirname,"../resources");
global.unpackResource = function(from,to){
    fs.emptyDirSync(path.join(global.RESOURCES_PATH,to));
    fs.copySync(from,path.join(global.RESOURCES_PATH,to))
}

global.unpackTo = function(from,to){
    fs.copySync(from,path.join(__dirname,"../",to))
}

// init argument block

if (operation == "init"){
    try{
        utils.checkArg(1)
        // checkArg(2)

    }catch(e){
        utils.usage("init");
        process.exit(1)
    }
    // changeDir("Test")
    print("Initializing app in "+path.join(process.cwd(),operand))
    // var cmd = exec(`cordova create ${operand} ${args[2]} ${operand}`)
    // changeDir(operand)
    // print("Cordova\n\n")
    utils.init(path.join(process.cwd(),operand))
    // cmd.stdout.on("data",function(chunk){
    //     print(chunk)
    // })

    // cmd.stdout.on("end",function(){
        
    // })
    // cmd.stderr.on("data",chunk => {
    //     print("CORDOVA ERROR: ",chunk)
    // })
}


//Update argument block

else if (operation == "update"){

    var config = {
        apiKey: "AIzaSyAougIsV_kErs5sk9ZzbTZFX2EaTIlucaI",
        authDomain: "webjs-f76df.firebaseapp.com",
        databaseURL: "https://webjs-f76df.firebaseio.com",
        projectId: "webjs-f76df",
        storageBucket: "webjs-f76df.appspot.com",
        messagingSenderId: "404258524081"
    };
    var app = firebase.initializeApp(config);
    var databaseRef = app.database().ref();
    var package = require(path.join(__dirname,"../package.json"));
    // console.log(flags().update.slice(-4))
    var updateVersion = "update-"+package.version.replace(/\./g,"-");
    var latestVersion = databaseRef.child(updateVersion);
    // console.log(latestVersion.);
    latestVersion.on("value",function(snapshot){
        var ver;
        if(utils.flags().version){
            ver = "updates."+updateVersion+"_"+utils.flags().version.split(".").join("");
        }else{
            ver = snapshot.val();
        }
        // console.log(snapshot.val())
        // process.exit()
        var lastUpdate = package["last-update"].replace(/\./g,"-")
        var sorted = [package["last-update"],ver].sort();
        // print(sorted)
        if(sorted[0] == package["last-update"] && sorted[0] != sorted[1]){
            console.log(chalk.green("Installing feature update "+ver.split("updates."+updateVersion+"_")[1].split("").join(".")));
            Install(ver).Then = function(err,p){
                if(err){
                    console.log(""+err);
                    console.log("Try installing that again and if it still doesn't work, open an issue at\nhttps://github.com/neutrino2211/webjs\nand please provide the error message above.");
                    process.exit(3);
                }else{
                    console.log(`Update complete`)
                    // console.log(package);
                    if(utils.flags().version == undefined){
                        package["last-update"] = ver;
                        fs.writeFileSync(path.join(__dirname,"../package.json"),JSON.stringify(package,null,"\t"))
                    }
                }
                process.exit()
            }
        }else{
            console.log(chalk.green("wjs is up to date"));
            process.exit()
        }
    })
}


//Install argument block

else if(operation == "install"){
    try {
        utils.checkArg(1)
    } catch (error) {
        utils.usage("install")
        process.exit()
    }

    Install(operand).Then = function(err,p){
        if(err){
            console.log(chalk.red(""+err));
            console.log("Try installing that again and if it still doesn't work, open an issue at\nhttps://github.com/neutrino2211/webjs\nand please provide the error message above.");
            process.exit(3);
        }else{
            console.log(`Download complete`)
        }
        process.exit()
    }
    
}


//Version argument block

else if(operation == "-v"){
    var json = fs.readFileSync(path.join(__dirname,"../","package.json")).toString();

    var pack = JSON.parse(json);

    var updateVersion = "update-"+pack.version.replace(/\./g,"-");

    // console.log(pack["last-update"],"updates."+updateVersion+"_");

    console.log("Version : "+pack.version+"\nCurrent update : "+pack["last-update"].split("updates."+updateVersion+"_")[1].split("").join("."));
}

//Add app dependency
else if(operation == "add"){
    var manifest = utils.getManifest();
    var ext = utils.extensions(manifest["project-type"]);
    var type = manifest["project-type"];
    // operand = operand.endsWith(ext) ? operand :operand+ext;
    if(fs.existsSync(path.join(projectDefinitions[type].modulesPath,operand)) && manifest.extraModules.indexOf(operand) == -1){
        manifest.extraModules.push(operand);
        manifest.extraModules.forEach((m)=>{
            fs.copySync(path.join(projectDefinitions[type].modulesPath,m),path.join(process.cwd(),"webjs_modules",m));
        })
        console.log("Dependency added")
    }
    else if(manifest.extraModules.indexOf(operand) > -1){
        console.log("Dependency already added");
    }
    else{
        Install(operand).Then = (err,path)=>{
            if(err){
                console.log(" "+err);
                console.log("Try installing that again and if it still doesn't work, open an issue at\nhttps://github.com/neutrino2211/webjs\nand please provide the error message above.");
                process.exit(3);
            }else{
                manifest.extraModules.push(operand);
                console.log(`Dependency ${path} added"`)
            }
        }
    }

    utils.makeManifest(manifest);
}

//Development

else if(operation == "run-dev" || operation == "development"){
    console.log(operation == "run-dev" ? "run-dev command is deprecated\nUse  \"wjs development\" " : "Development")
    var manifest = utils.getManifest();
    s = server.Start(3100);
    //declare websocket for refreshing web page.
    var ws = new websocket.server({
        httpServer: s
    })
    // var c;
    ws.on("request", (res) => {
        var connection = res.accept('',res.origin);
        // connection.send("refresh")
        c = connection;
    })

    var SR /*server root*/  = projectDefinitions[manifest["project-type"]].serverRoot;
    var AR /*app root */    = projectDefinitions[manifest["project-type"]].root;
    var PT /*project type*/ = manifest["project-type"];
    if(PT == "javascript" || PT == "typescript"){
        utils.writeDev(process.cwd());
    }
    // console.log(path.join(process.cwd(),AR))
    server.Source = path.join(process.cwd(),SR);
    utils.compile(c)
    fs.watch(path.join(process.cwd(),AR),{
        recursive: true
    }, ()=>{
        utils.compile(c)
    })
}

else if(operation == "check-update"){
    var config = {
        apiKey: "AIzaSyAougIsV_kErs5sk9ZzbTZFX2EaTIlucaI",
        authDomain: "webjs-f76df.firebaseapp.com",
        databaseURL: "https://webjs-f76df.firebaseio.com",
        projectId: "webjs-f76df",
        storageBucket: "webjs-f76df.appspot.com",
        messagingSenderId: "404258524081"
    };
    var app = firebase.initializeApp(config);
    var databaseRef = app.database().ref();
    var package = require(path.join(__dirname,"../package.json"));
    var updateVersion = "update-"+package.version.replace(/\./g,"-");
    var latestVersion = databaseRef.child("update-"+package.version.replace(/\./g,"-"));
    // console.log(latestVersion.);
    latestVersion.on("value",function(snapshot){
        var ver = snapshot.val();
        // console.log(snapshot.val())
        // process.exit()
        // console.log(b)
        var lastUpdate = package["last-update"].replace(/\./g,"-")
        var sorted = [package["last-update"],ver].sort();
        // print(sorted[0],package["last-update"],sorted)
        if(sorted[0] == package["last-update"] && sorted[0] != sorted[1]){
            console.log(chalk.green("FOUND UPDATE "+ver.split("updates."+updateVersion+"_")[1].split("").join(".")));
            // console.log("Available updates\n"+chalk.green(b.join("\n")))
            console.log("Run "+chalk.grey("wjs update ")+"to update")
        }else{
            console.log(chalk.green("wjs is up to date"));
        }
        process.exit()
    })
}

else if(operation == "publish"){
    var Zip = require("adm-zip");
    var zip = new Zip();

    if(!fs.existsSync(path.join(process.cwd(),operand))){
        print(chalk.red("Error : folder '"+chalk.yellow(operand)+"' not found"))
        process.exit()
    }

    var term = require("terminal-kit").terminal;
    var Progress = term.progressBar({
        width: 80,
        title: "Publishing module",
        eta: true,
        percent: true
    });

    Progress.update(0)

    var destinationZip = path.join(process.cwd(),operand+".zip");

    zip.addLocalFolder(operand);

    Progress.update(10);
    
    zip.writeZip(destinationZip);

    Progress.update(20);

    var gcs = require('@google-cloud/storage');

    process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname,'../gcloud.json');
    var storage = gcs({
        projectId: 'webjs-f76df',
        keyFileName: path.join(__dirname,'../gcloud.json')
    });

    var TYPE = utils.flags().type||"updates";
    // console.log(type);
    var bucket = storage.bucket("webjs-f76df.appspot.com");
    var upload = bucket.upload(destinationZip,{destination: TYPE+"s/"+operand+".zip"},function(e,f){
        // console.log(f)
        if(e){
            print(chalk.red(""+e))
            term("\n")
            process.exit(11);
        }else{
            Progress.update(100)
            print(chalk.green("Published "+operand))
        }
    })
}

else if(operation == "build"){
    utils.quietCompile(utils.build);
}

else if(operation == "run"){
    try{
        utils.checkArg(1)
        // checkArg(2)

    }catch(e){
        utils.usage("run");
        process.exit(1)
    }
    var p = require(path.join(__dirname,"../package.json"));
    if(p["wjs:installedModules"][operand]){
        var m = require(p["wjs:installedModules"][operand]);
        m(process.cwd(),utils.flags(args.slice(2)))
    }else{
        console.log(chalk.red("Can not find module ("+operand+")"))
    }
}

else if(operation == "tasks"){
    var p = require(path.join(__dirname,"../package.json"));
    var m = p["wjs:installedModules"];
    var modules = Object.getOwnPropertyNames(m);
    if(modules.length == 0){
        console.log(chalk.red("No tasks installed"));
        process.exit()
    }
    modules.forEach(function(name){
        console.log(chalk.green(name)+chalk.yellow(" -> ")+chalk.blue(m[name]))
    })
}

else if(operation == "-h" || operation == "--help" || operation == "help"){
    utils.usage("*");
}

else {
    utils.usage("*");
}