#!/usr/bin/env node

//Greetings
console.log("WJS cli:")
var print = console.log;

//Declare variables
var fs                 = require("fs-extra");
var path               = require("path");
var args               = process.argv.slice(2,process.argv.length);
var utils              = require('./utils');
var flags              = utils.flags(args);
var chalk              = require("chalk");
var Install            = require("./install");
var firebase           = require("firebase");
var projectDefinitions = require("./proj-def");
//Specify argument types

var compiling = false;

if(args.length > 0){
    var operation = args[0];
    var operand   = args[1];
}else{
    console.log(chalk.red("No arguments"))
}

global.BIN_PATH = path.join(__dirname,"../../node_modules/.bin")
global.RESOURCES_PATH = path.join(__dirname,"../../resources");
global.unpackResource = function(from,to){
    fs.emptyDirSync(path.join(global.RESOURCES_PATH,to));
    fs.copySync(from,path.join(global.RESOURCES_PATH,to))
}

global.unpackTo = function(from,to){
    fs.copySync(from,path.join(__dirname,"../../",to))
}

function Development(flags){
    var express            = require("express");
    var manifest = utils.getManifest();

    var SR /*server root*/  = projectDefinitions[manifest["project-type"]].serverRoot;
    var AR /*app root */    = projectDefinitions[manifest["project-type"]].root;
    var PT /*project type*/ = manifest["project-type"];

    var port = 3100;

    global.flags = flags;
    global.port  = flags.port||port;

    var app = express();
    var middleware = function(req,res,next){
        console.log(`Debug [${Date()}]: ${chalk.default.blue(req.url)}`)
        if(req.url.endsWith("/") && req.url != "/"){
            req.url = req.url.slice(0,-1)
        }
        next()
    }
    app.use(middleware)
    app.use(express.static(SR))
    var l = app.listen(global.port);
    var os = require('os');
    var ifaces = os.networkInterfaces();

    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
            }

            if (alias >= 1) {
            // this single interface has multiple ipv4 addresses
            console.log(ifname + ':' + alias, iface.address);
            } else {
            // this interface has only one ipv4 adress
            console.log(ifname, iface.address);
            }
            ++alias;
        });
    });
    console.log("App is available on http://localhost:"+l.address().port)
    console.log("Watching "+manifest.entry)
    process.env.NODE_ENV = "development"
    compiling = true
    utils.compile(function(){
        compiling = false
    })
    fs.watch(AR,{
        recursive: true
    },function(c){
        if(c=="change"&&!compiling){
            compiling = true
            utils.compile(function(){
                compiling = false
            })
        }
    })

    if(flags.o||flags.open){
        require('opn')('http://localhost:'+port);
    }
}

function Init(operand,cwd,flags){
    try{
        utils.checkArg(1)

    }catch(e){
        utils.usage("init");
        process.exit(1)
    }
    print("Initializing app in "+path.join(process.cwd(),operand))
    utils.init(path.join(cwd,operand),flags)
}

function Update(flags){
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
    var package = require(path.join(__dirname,"../../package.json"));
    // console.log(flags().update.slice(-4))
    var updateVersion = "update-"+package.version.replace(/\./g,"-");
    var latestVersion = databaseRef.child(updateVersion);
    // console.log(latestVersion.);
    latestVersion.on("value",function(snapshot){
        var ver;
        if(flags.version){
            ver = "updates."+updateVersion+"_"+flags.version.split(".").join("");
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
                    if(flags.version == undefined){
                        package["last-update"] = ver;
                        fs.writeFileSync(path.join(__dirname,"../../package.json"),JSON.stringify(package,null,"\t"))
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

function INSTALL(operand){
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

function Version(){
    var json = fs.readFileSync(path.join(__dirname,"../../","package.json")).toString();

    var pack = JSON.parse(json);

    var updateVersion = "update-"+pack.version.replace(/\./g,"-");

    // console.log(pack["last-update"],"updates."+updateVersion+"_");

    console.log("Version : "+pack.version+"\nCurrent update : "+pack["last-update"].split("updates."+updateVersion+"_")[1].split("").join("."));
}

function Add(operand,cwd){
    var manifest = utils.getManifest(cwd);
    var ext = utils.extensions(manifest["project-type"]);
    var type = manifest["project-type"];
    // operand = operand.endsWith(ext) ? operand :operand+ext;
    if(fs.existsSync(path.join(projectDefinitions[type].modulesPath,operand)) && manifest.extraModules.indexOf(operand) == -1){
        manifest.extraModules.push(operand);
        manifest.extraModules.forEach((m)=>{
            fs.copySync(path.join(projectDefinitions[type].modulesPath,m),path.join(cwd,"webjs_modules",m));
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

function CheckUpdate(){
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
    // console.log(latestVersion);
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

function Publish (operand,cwd,flags){
    var Zip = require("adm-zip");
    var zip = new Zip();

    if(!fs.existsSync(path.join(cwd,operand))){
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

    var destinationZip = path.join(cwd,operand+".zip");

    zip.addLocalFolder(operand);

    Progress.update(10);
    
    zip.writeZip(destinationZip);

    Progress.update(20);

    var gcs = require('@google-cloud/storage');

    process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname,'../../gcloud.json');
    var storage = gcs({
        projectId: 'webjs-f76df',
        keyFileName: path.join(__dirname,'../../gcloud.json')
    });

    if(!flags.type){
        console.log(chalk.red("Type of module not specified"))
        console.log("Exiting");
        process.exit(12)
    }

    var TYPE = flags.type;

    if(flags.type == "update" && flags.password != ""){
        var config = {
            apiKey: "AIzaSyAougIsV_kErs5sk9ZzbTZFX2EaTIlucaI",
            authDomain: "webjs-f76df.firebaseapp.com",
            databaseURL: "https://webjs-f76df.firebaseio.com",
            projectId: "webjs-f76df",
            storageBucket: "webjs-f76df.appspot.com",
            messagingSenderId: "404258524081"
        };
        var app = firebase.initializeApp(config);
        print("Authenticating\n")
        app.auth().signInWithEmailAndPassword(flags.email,flags.password)
        .then(function(){
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
        })
        .catch(function(e){
            console.log(chalk.red("Authentication"+e))
        })
    }else{
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
    // console.log(type);
}

function Run(operand,cwd,flags,test){
    try{
        utils.checkArg(1)

    }catch(e){
        utils.usage("run");
        process.exit(1)
    }
    var p = require(path.join(__dirname,"../../package.json"));
    if(!test){
        if(p["wjs:installedModules"][operand]){
            var m = require(p["wjs:installedModules"][operand]);
            m(cwd,flags,utils)
        }else{
            console.log(chalk.red("Can not find module ("+operand+")"))
        }
    } else {
        if(fs.existsSync(test)){
            var m = require(test);
            m(cwd,flags,utils)
        }else{
            console.log(chalk.red("Can not find module ("+operand+")"))
        }
    }
}

exports.init        = Init;
exports.install     = INSTALL;
exports.publish     = Publish;
exports.development = Development;
exports.operation = operation;
exports.operand = operand;
exports.flags = flags;
exports.update = Update;
exports.version = Version;
exports.run = Run;
exports.checkUpdate = CheckUpdate;
exports.add = Add;