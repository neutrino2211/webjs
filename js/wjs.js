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

function add_dependency(m){
    var manifest = utils.getManifest()
    var type = manifest["project-type"];
    print("Adding dependency ["+m+"]")
    if(fs.existsSync(path.join(projectDefinitions[type].modulesPath,m))){
        // print("Not native")
        fs.copySync(path.join(projectDefinitions[type].modulesPath,m),path.join(process.cwd(),"webjs_modules",m));
    } else if(fs.existsSync(path.join(__dirname,"../../resources/java/modules",m.split(".").reverse()[0]))){
        if(manifest.android && manifest.android.extraModules){
            if(manifest.android.extraModules.indexOf(m.split(".").reverse()[0]) > -1){
                print(chalk.green("Dependency added"))
                process.exit()
            } else {
                manifest.android.extraModules.push(m.split(".").reverse()[0])
            }
        } else if(manifest.android) {
            manifest.android.extraModules = []
            manifest.android.extraModules.push(m.split(".").reverse()[0])
            // print(chalk.green("Dependency added"))
        } else {
            print(chalk.red("Error: '"+m+"' is a native module and needs an android configuration to work"))
        }
    }
    utils.makeManifest(manifest)
}

function isNativeModule(n){
    return fs.existsSync(path.join(__dirname,"../../resources/java/modules",n.split(".").reverse()[0]))
}

function isDefault(o){
    var defaults = [ 'resources\\vue-modules\\app.js',
    'resources\\vue-modules\\definitions.js',
    'resources\\vue-modules\\material.js',
    'resources\\vue-modules\\media.js',
    'resources\\Typescript\\app.ts',
    'resources\\Typescript\\debug.ts',
    'resources\\Typescript\\material.ts',
    'resources\\WTS\\app.js',
    'resources\\WTS\\debug.js',
    'resources\\WTS\\material.js' ]
    defaults.forEach((j)=>{
        if(o.endsWith(j))return true;
    })
    return false;
}

function remove(operand){
    if(isNativeModule(operand)){
        fs.removeSync(path.join(__dirname,"../../resources/java/modules",operand.split(".").reverse()[0]))
        print("Removed: "+operand)
        process.exit(1)
    }
    var l1 = fs.readdirSync(path.join(__dirname,"../../resources/vue-modules")).map(function(n){
        return path.join(__dirname,"../../resources/vue-modules",n)
    })
    var l2 = fs.readdirSync(path.join(__dirname,"../../resources/Typescript")).map(function(n){
        return path.join(__dirname,"../../resources/Typescript",n)
    })
    var l3 = fs.readdirSync(path.join(__dirname,"../../resources/WTS")).map(function(n){
        return path.join(__dirname,"../../resources/WTS",n)
    })
    var l4 = fs.readdirSync(path.join(__dirname,"../../modules")).map(function(n){
        return path.join(__dirname,"../../modules",n)
    })
    var l = l1.concat(l2).concat(l3).concat(l4)
    var inPromise = false;
    l.forEach(function(e){
        var s = e.split(path.sep);
        if(s[s.length-1] == operand && isDefault(e) && !inPromise){
            inPromise = true
            utils._ask(require("terminal-kit").terminal,"This is a default module used by wjs-cli.\nAre you sure you want to remove it? [y/n] : ")
            .then(function(r){
                if(r == "y"){
                    fs.removeSync(e)
                    print("\n"+chalk.green("Removed: "+operand))
                } else {
                    print("\n"+chalk.green("Good choice"))
                }
                process.exit()
            })
        } else if(s[s.length-1] == operand && !inPromise){
            var conf = utils.parseConf(path.join(e,"module.conf"))
            // print(s[s.length-1])
            if(conf.type === "task"){
                utils.removeTask(s[s.length-1].split(".").reverse()[0])
            }
            fs.removeSync(e)
            print(chalk.green("Removed: "+operand))
            process.exit()
        }
    })
    print(chalk.red("Error: Can't find "+operand))
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
    if(flags.debug){
        var middleware = function(req,res,next){
            console.log(`Debug [${Date()}]: ${chalk.default.blue(req.url)}`)
            if(req.url.endsWith("/") && req.url != "/"){
                req.url = req.url.slice(0,-1)
            }
            next()
        }
        app.use(middleware)
    }
    app.use(express.static(SR))
    var l = app.listen(global.port);
    console.log("App is available on http://localhost:"+l.address().port)
    console.log("Watching "+manifest.entry)
    process.env.NODE_ENV = "development"
    utils.compile(undefined,{watch:"true",publicUrl:"./",contentHash:false})

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

function INSTALL(operand){
    try {
        utils.checkArg(1)
    } catch (error) {
        utils.usage("install")
        process.exit()
    }

    Install(operand).then(function(){
        console.log(`Download complete`)
        process.exit()
    }).catch(function(err){
        if(err.toString().startsWith("Error: No such object")){
            console.log(chalk.red("Error: Can't find '"+operand+"'"))
            console.log("Check the name and try again.")
        } else {
            console.log(chalk.red(err.toString()));
            console.log("Try installing that again and if it still doesn't work, open an issue at\nhttps://github.com/neutrino2211/webjs\nand please provide the error message above.");
        }
        process.exit(3);
    })
}

function Version(){
    var json = fs.readFileSync(path.join(__dirname,"../../","package.json")).toString();

    var pack = JSON.parse(json);

    // console.log(pack["last-update"],"updates."+updateVersion+"_");

    console.log("Version : "+pack.version);
}

function Add(operand,cwd){
    var manifest = utils.getManifest(cwd);
    var ext = utils.extensions(manifest["project-type"]);
    var type = manifest["project-type"];
    // operand = operand.endsWith(ext) ? operand :operand+ext;
    if(fs.existsSync(path.join(projectDefinitions[type].modulesPath,operand)) && manifest.extraModules.indexOf(operand) == -1){
        manifest.extraModules.push(operand);
        manifest.extraModules.forEach((m)=>{
            // fs.copySync(path.join(projectDefinitions[type].modulesPath,m),path.join(cwd,"webjs_modules",m));
            add_dependency(m)
        })
        console.log(`Dependency ${operand} added`)
    }
    else if(manifest.extraModules.indexOf(operand) > -1){
        console.log("Dependency already added");
    }
    else{
        Install(operand).then((path)=>{
            // manifest.extraModules.push(operand);
            add_dependency(operand)
            console.log(`Dependency ${path} added`)
        }).catch(function(err){
            console.log(err.toString());
            console.log("Try installing that again and if it still doesn't work, open an issue at\nhttps://github.com/neutrino2211/webjs\nand please provide the error message above.");
            process.exit(3);
        })
    }

    utils.makeManifest(manifest);
}

function Publish (operand,cwd,flags){
    var Zip = require("adm-zip");
    var zip = new Zip();
    var store = require("@google-cloud/storage").Storage
    var bucket = new store({
        projectId: "webjs-f76df",
        keyFile: "./gcloud.json"
    }).bucket("webjs-f76df.appspot.com")
    var intoStream = require("into-stream")
    if(!flags.type){
        console.log(chalk.red("Type of module not specified, use the --type flag"))
        console.log("Exiting");
        process.exit(12)
    }
    if(!fs.existsSync(path.join(cwd,operand))){
        print(chalk.red("Error : folder '"+chalk.yellow(operand)+"' not found"))
        process.exit()
    }
    // operand = (function(){var dir = path.join(cwd,operand).split(path.sep);return dir[dir.length-1]})();
    // print(operand)
    var term = require("terminal-kit").terminal;
    var Progress = term.progressBar({
        width: 80,
        title: "Publishing module",
        eta: true,
        percent: true
    });

    Progress.update(0)

    zip.addLocalFolder(operand);

    Progress.update(1);

    var buffer = zip.toBuffer()

    var TYPE;
    switch (flags.type) {
        case "task":
            TYPE = "taskEngines"
            break;
        case "module":
            TYPE = "modules"
            break;
        default:
            print(chalk.default.red(`Error: "${flags.type}" is not a publishable package`))
            process.exit(1);
            break;
    }
    var destPath = (function(){var dir = path.join(cwd,operand).split(path.sep);return dir[dir.length-1]})();
    // if(TYPE == "update" && flags.password != ""){
    //     var config = {
    //         apiKey: "AIzaSyAougIsV_kErs5sk9ZzbTZFX2EaTIlucaI",
    //         authDomain: "webjs-f76df.firebaseapp.com",
    //         databaseURL: "https://webjs-f76df.firebaseio.com",
    //         projectId: "webjs-f76df",
    //         storageBucket: "webjs-f76df.appspot.com",
    //         messagingSenderId: "404258524081"
    //     };
    //     var app = firebase.initializeApp(config);
    //     print("Authenticating\n")
    //     app.auth().signInWithEmailAndPassword(flags.email,flags.password)
    //     .then(function(){
    //         var storeFileStream = bucket.file(TYPE+"/"+destPath+".zip").createWriteStream()
    //         intoStream(buffer).pipe(storeFileStream).on("end",function(){
    //             if(e){
    //                 print(chalk.red(""+e))
    //                 term("\n")
    //                 process.exit(11);
    //             }else{
    //                 Progress.update(100)
    //                 print(chalk.green("Published "+destPath))
    //             }
    //         })
    //         // bucket.upload(destinationZip,{destination: },function(e,f){
    //         //     // console.log(f)
                
    //         // })
    //     })
    //     .catch(function(e){
    //         console.log(chalk.red("Authentication"+e))
    //     })
    // }else{
        
    // }
    // console.log(type);
    var storeFile = bucket.file(TYPE+"/"+destPath+".zip")
    var storeFileStream = storeFile.createWriteStream({
        metadata: {
            contentType: "application/zip"
        }
    });
    intoStream(buffer).pipe(storeFileStream).on("end",function(){
        if(e){
            print(chalk.red(""+e))
            term("\n")
            process.exit(11);
        }else{
            Progress.update(100)
            print(chalk.green("Published "+destPath))
        }
    })
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
        if(p["wjs:installedTasks"][operand]){
            var m = require(p["wjs:installedTasks"][operand]);
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
exports.version = Version;
exports.run = Run;
exports.add = Add;
exports.remove = remove;