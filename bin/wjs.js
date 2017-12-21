#!/usr/bin/env node

//Greetings
console.log("WJS cli:")
var print = console.log;
//IMPORTANT functions

// process.on("uncaughtException", (err) => {
//     console.log(err)
// })

function flags(){
    var flags = [];
    var map = {};

    process.argv.forEach((f)=>{
        if(f.startsWith("--")){
            flags.push(f);
        }
    })

    flags.forEach((f)=>{
        if(f.indexOf("=") > 0){
            var v = f.slice(2).split("=")[1];
            if(f.slice(2).split("=")[1].indexOf(",") > -1){
                v = f.slice(2).split("=")[1].split(",");
            }
            map[f.slice(2).split("=")[0]] = v;
        }else{
            map[f.slice(2)] = true;
        }
    })

    return map;
}

function mode(flags){
    if(flags.typescript){
        return "typescript";
    }else if(flags.angular){
        return "angular";
    }else if(flags.vue){
        return "vue";
    }else if(flags.react){
        return "react";
    }else if(flags.flame){
        return "flame"
    }else{
        return "javascript";
    }
}


function extensions(extension){
    if("typescript" == extension){
        return ".ts";
    }else if("vue" == extension){
        return ".js";
    }else if("angular" == extension){
        return ".ts";
    }else if("react" == extension){
        return ".jsx";
    }else{
        return ".js";
    }
}

function checkArg(position){
    if(!args[position]){
        throw new TypeError("Error at argument ("+position+") expected [STRING] found [NULL]")
    }
}
function changeDir(dir){
    process.chdir(dir)
}
function refresh(c){
    if(c){
        c.send("refresh")
    }else{
        console.log(`Open ${chalk.blue.bold("http://localhost:3100")} to enable hot reload`);
    }
}

// console.log(flags());

function init(directory){
    var flag = flags();
    var type = mode(flag);
    var config = projectDefinitions[type].config;

    var wjsManifest = `{
    "project-type" : "${type}",
    "compileCommand" : "${projectDefinitions[type].compileCommand?projectDefinitions[type].compileCommand:"webpack"}",
    "root": "${projectDefinitions[type].serverRoot?projectDefinitions[type].serverRoot:"www"}",
    "extraModules": []
}`;
    var wjsDefaultModules = projectDefinitions[type].defaultModules;

    // fs.writeFileSync(path.join(directory,"wjs-config.json"),wjsManifest);
    // if(fs.existsSync(directory))fs.removeSync(directory);
    if(flag.typescript || flag.angular){
        fs.writeFileSync(path.join(directory,"tsconfig.json"),`{
            "compilerOptions":{
                "noImplicitAny": false,
                "removeComments": true,
                "preserveConstEnums": true,
                "experimentalDecorators": true,
                "allowJs": true,
                "module": "es6",
                "target": "ES2015"
            },
            "include":[
                "app/**/*"
            ]
        }
        `)
    }
    
    if(projectDefinitions[type].entry){
        fs.mkdirpSync(path.join(directory,"app"))
        fs.mkdirpSync(path.join(directory,"www"))
        fs.writeFileSync(path.join(directory,projectDefinitions[type].entry),projectDefinitions[type].appContents);
    }

    if(config){
        fs.writeFileSync(path.join(directory,"webpack.config.js"),config)
    }
    // fs.copySync(path.join(__dirname,"../resources","WTS"),path.join(directory,"webjs_modules"))
    // fs.copySync(path.join(__dirname,"index.html"),path.join(directory,"www","i"))
    wjsDefaultModules.forEach((m)=>{
        fs.copySync(path.join(projectDefinitions[type].modulesPath,m),path.join(directory,"webjs_modules",m));
    })
    if(!flag.vue){
        fs.copySync(path.join(__dirname,"../resources","jsconfig.rsrc.json"),path.join(directory,"app","jsconfig.json"))
        var customHtml = fs.readFileSync(path.join(__dirname,"../resources","dev-index.html")).toString("utf-8")
        fs.writeFileSync(path.join(directory,"www","index.html"),customHtml);
        fs.copySync(path.join(__dirname,"../resources","js"),path.join(directory,"www","js"))
        fs.copySync(path.join(__dirname,"../resources","styles"),path.join(directory,"www","css"))
        fs.copySync(path.join(__dirname,"../resources","fonts"),path.join(directory,"www","fonts"))
    }else{
        fs.copySync(path.join(__dirname,"../resources","vue"),path.join(directory))
    }
    fs.writeFileSync(path.join(directory,"wjs-config.json"),wjsManifest);
    // if(process.platform == "win32"){
    //     // cordovaCLI("platform add android")
    //     var platform = exec("cordova platform add android")

    //     console.log("Running platform add android for cordova")

    //     platform.stdout.on("data", console.log)

    //     platform.stdout.on("end",()=>{
    //         console.log("Done")
    //     })
    // } else if(process.platform == "darwin"){
    //     // cordovaCLI("platform add ios")

    //     var platform = exec("cordova platform add ios")
        
    //     console.log("Running platform add ios for cordova")

    //     platform.stdout.on("data", console.log)

    //     platform.stdout.on("end",()=>{
    //         console.log("Done")
    //     })
    // }
}
function compile(c){
    console.log("Compiling....")
    getProjectDependencies(process.cwd())
    var manifest = getManifest();
    var compile = exec(manifest.compileCommand);
    compile.stdout.on("end",() => {
        console.log("App running in "+chalk.blue.bold("http://localhost:3100"))
        refresh(c)
        // c.send("refresh")
        // compile.kill()
        compile.removeAllListeners()
    })
    compile.stderr.on("data",()=>{
        console.log("Error compiling");
        process.exit(2)
    })
}

function getProjectDependencies(directory){
    if(fs.pathExistsSync(path.join(directory,"app","pages"))){
        fs.copySync(path.join(directory,"app","pages"),path.join(directory,"www","pages"))
    }
    var man = getManifest();
    var type = man["project-type"];
    
    man.extraModules.forEach((m)=>{
        fs.copySync(path.join(projectDefinitions[type].modulesPath,m),path.join(directory,"webjs_modules",m));
    })
}

function Install(operand){
    var self = {};
    var wjsModule = operand.split(".").join("/")
    
    var adm_zip = require("adm-zip");

    var modulesPath = path.join(__dirname,"../modules")
    var modulePath = path.join(modulesPath,operand+".zip")
    var gcs = require('@google-cloud/storage');
    process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname,'../gcloud.json');
    var storage = gcs({
        projectId: 'webjs-f76df',
        keyFileName: path.join(__dirname,'../gcloud.json')
    });


    var bucket = storage.bucket("webjs-f76df.appspot.com");
    console.log("Downloading...")
    bucket.file(wjsModule+".zip").download({
        destination: modulePath
    },(err)=>{
        if (err){
            // console.log(err)
            fs.removeSync(modulePath);
            self.Then(err,undefined)
        }else{
            console.log("Download complete")
            // fs.emptyDirSync(resourcePath)
            var zip = new adm_zip(modulePath);
            console.log("Unpacking...")
            zip.extractAllTo(modulesPath,true)
            console.log("Installing...")
            require(path.join(modulesPath,operand.split(".")[1],"install.js"))
            console.log("Cleaning Up...");
            fs.removeSync(modulePath);
            console.log("Successfully installed "+operand)
            self.Then(undefined,modulePath);
        }
    })

    return self;
}

function build(directory){
    fs.mkdirpSync(path.join(directory,"dist"));

    fs.copySync(path.join(directory,"www"),path.join(directory,"dist"));
}

function buildFlame(directory){
    build(directory);

    fs.removeSync(path.join(directory,"dist","www","index.html"));

    fs.renameSync(path.join(directory,"dist","www","entry.html"),path.join(directory,"dist","www","index.html"));
}

/**
 * @return {Array<String>}
 */
function getModules(){
    return fs.readdirSync(path.join(process.cwd(),"webjs_modules"));
}

/**
 * @returns {Map<Object>}
 */
function getManifest(){
    var manifest;
    if(fs.existsSync(path.join(process.cwd(),"wjs-config.json"))){
        return JSON.parse(fs.readFileSync(path.join(process.cwd(),"wjs-config.json")).toString("utf-8"));   
    }else{
        return {"project-type":"javascript",compileCommand: "webpack",extraModules:[]};
    }
}

function makeManifest(Manifest){
    fs.writeFileSync(path.join(process.cwd(),"wjs-config.json"),JSON.stringify(Manifest,undefined,"\t"));
}

function cordovaCompile(cb){
    console.log("Compiling....")
    var compile = exec("webpack");
    compile.stdout.on("end",() => {
        // console.log("App running in "+chalk.blue.bold("http://localhost:3100"))
        cb()
        // refresh(c)
        // c.send("refresh")
    })
    compile.stderr.on("data",()=>{
        console.log("Error compiling");
        process.exit(2)
    })
}

function compileAndRefresh(c){
    console.log("Compiling....")
    // getProjectDependencies(process.cwd())
    var manifest = getManifest();
    compile()
    var cmp = exec(manifest.compileCommand);
    cmp.stdout.on("end",() => {
        console.log("App running in "+chalk.blue.bold("http://localhost:3100"))
        refresh(c)
        // c.send("refresh")
        // cmp.kill()
        cmp.removeAllListeners()
    })
    cmp.stderr.on("data",()=>{
        console.log("Error compiling");
        process.exit(2)
    })
}

function writeDev(directory){
    fs.writeFileSync(path.join(directory,"www","index.html"),fs.readFileSync(path.join(__dirname,"../resources","dev-index.html")).toString("utf-8"))
}

function writePro(directory){
    fs.writeFileSync(path.join(directory,"www","index.html"),fs.readFileSync(path.join(__dirname,"../resources","index.html")).toString("utf-8"))
}

function usage(name){
    var commands = {
        add: "Usage: wjs add <module>",
        init: "Usage: wjs init <App-name> <option>\noptions:\n\t--javascript\n\t--typescript\n\t--vue",
        install : "Usage: wjs install <module>"
    }
    if(name == "*"){
        Object.getOwnPropertyNames(commands).forEach((c)=>{
            print(commands[c]);
        })
    }
    print(commands[name]);
}

//Declare variables
var s;
var c;
var fs               = require("fs-extra");
var cwd              = process.cwd();
var path             = require("path");
var http             = require("https");
var args             = process.argv.slice(2,process.argv.length);
var exec             = require("child_process").exec;
var chalk            = require("chalk");
var server           = require("../resources/server");
var websocket        = require("websocket");
var projectDefinitions = require("./proj-def")
// var cordovaCLI       = require("cordova/src/cli");
// var typescript       = require("typescript");
// var cordovaAPIS      = require("cordova-lib");
var refreshMode      = "initial";
// var cordovaFunctions = require("cordova/cordova");
//Specify argument types

if(args.length > 0){
    var operation = args[0];
    var operand   = args[1];
}

//

process.env.RESOURCES_PATH = path.join(__dirname,"../resources");
process.RESOURCES_PATH = path.join(process.env.RESOURCES_PATH,"WTS");
process.env.unpackResource = function(file,dirname){
    fs.renameSync(path.join(dirname,file),path.join(process.RESOURCES_PATH,file))
}

// init argument block

if (operation == "init"){
    try{
        checkArg(1)
        // checkArg(2)

    }catch(e){
        usage("init");
        process.exit(1)
    }
    // changeDir("Test")
    print("Initializing app in "+path.join(process.cwd(),operand))
    // var cmd = exec(`cordova create ${operand} ${args[2]} ${operand}`)
    // changeDir(operand)
    // print("Cordova\n\n")
    init(path.join(process.cwd(),operand))
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

    var adm_zip = require("adm-zip");

    var updatePath = path.join(__dirname,"../resources/update.zip");
    var resourcePath = path.join(__dirname,"../resources")
    var gcs = require('@google-cloud/storage');
    process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname,'../gcloud.json');
    var storage = gcs({
        projectId: 'webjs-f76df',
        keyFileName: path.join(__dirname,'../gcloud.json')
    });


    var bucket = storage.bucket("webjs-f76df.appspot.com");
    console.log("Downloading...")
    bucket.file("resources.zip").download({
        destination: updatePath
    },(err)=>{
        if (err){
            console.log(err.Error)
        }else{
            console.log("Download complete")
            // fs.emptyDirSync(resourcePath)
            var zip = new adm_zip(updatePath);
            console.log("Unpacking...")
            zip.extractAllTo(path.join(__dirname,"../"),true)
            console.log("Update complete")
        }
    })
}


//Install argument block

else if(operation == "install"){
    try {
        checkArg(1)
    } catch (error) {
        usage("install")
        process.exit()
    }

    Install(operand);
    
}


//Version argument block

else if(operation == "-v"){
    var json = fs.readFileSync(path.join(__dirname,"../","package.json")).toString();

    var version = JSON.parse(json).version;

    console.log(version);
}

//Add app dependency
else if(operation == "add"){
    var manifest = getManifest();
    var ext = extensions(manifest["project-type"]);
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
                console.log(err);
                console.log("Try installing that again and if it still doesn't work, open an issue at\nhttps://github.com/neutrino2211/webjs\nand please provide the error message above.");
                process.exit(3);
            }else{
                manifest.extraModules.push(operand);
                console.log(`Dependency ${path} added"`)
            }
        }
    }

    makeManifest(manifest);
}

//Development

else if(operation == "run-dev" || operation == "development"){
    console.log(operation == "run-dev" ? "run-dev command is deprecated\nUse  \"wjs development\" " : "Development")
    var manifest = getManifest();
    s = server.Start(3100)
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
    
    if(manifest["project-type"] == "vue"){
        server.Source = path.join(process.cwd(),"dist");
        compile(c)
        fs.watch(path.join(process.cwd(),"src"),{
            recursive: true
        }, ()=>{
            compile(c)
            // refresh(c)
            // c.send("refresh")
        })
    }else{
        writeDev(process.cwd())
        server.Source = path.join(process.cwd(),"www");
        compile(c)
        fs.watch(path.join(process.cwd(),"app"),{
            recursive: true
        }, ()=>{
            compile(c)
            // refresh(c)
            // c.send("refresh")
        })
    }
}

else if(operation == "-h" || operation == "--help" || operation == "help"){
    usage("*")
}