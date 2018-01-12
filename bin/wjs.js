#!/usr/bin/env node

//Greetings
console.log("WJS cli:")
var print = console.log;
//IMPORTANT functions

// process.on("uncaughtException", (err) => {
//     console.log(err)
// })
function makeGradleBuild(packageName){
    var gradle_build_path = path.join(__dirname,"../resources/android/app/build.gradle");
    var resource_gradle_build_path = path.join(__dirname,"../resources/java/build.gradle");
    fs.writeFileSync(gradle_build_path,fs.readFileSync(resource_gradle_build_path).toString("utf-8").replace(/{{PACKAGE_NAME}}/g,packageName));
}
function makeApplicationIcons(androidManifest){
    var normalImagePath;
    var circularImagePath;

    if(!androidManifest.icons){
        console.log(chalk.yellow("Warning: no image files specified for "+androidManifest.app_name));
        // process.exit(8);
        normalImagePath = path.join(__dirname,"../resources/java/ic_launcher.png");
        circularImagePath = path.join(__dirname,"../resources/java/ic_launcher_round.png");
    }else{
        normalImagePath = path.join(process.cwd(),androidManifest.icons.normal);
        circularImagePath = path.join(process.cwd(),androidManifest.icons.circular);
    }

    var launchers_path = path.join(__dirname,"../resources/android/app/src/main/res"); 
    var launcher_types = ["h","m","xh","xxh","xxxh"];
    var launcher_resolutions = {
        "0": {
            width: 72,
            height: 72
        },
        "1": {
            width: 48,
            height: 48
        },
        "2": {
            width: 96,
            height: 96
        },
        "3": {
            width: 144,
            height: 144
        },
        "4": {
            width: 192,
            height: 192
        }
    };

    launcher_types.forEach(function(type,index){
        var resolution = launcher_resolutions[index.toString()];

        resize_image(new Buffer(fs.readFileSync(normalImagePath)),resolution).then(function(buffer){
            fs.writeFileSync(path.join(launchers_path,"mipmap-"+type+"dpi","ic_launcher.png"),buffer);
        }).catch(function(err){
            console.log(chalk.red(" "+err));
        });

        resize_image(new Buffer(fs.readFileSync(circularImagePath)),resolution).then(function(buffer){
            fs.writeFileSync(path.join(launchers_path,"mipmap-"+type+"dpi","ic_launcher_round.png"),buffer);
        }).catch(function(err){
            console.log(chalk.red(" "+err));
        });
    })    

    // normalImage.onload = function(){
    //     launcher_types.forEach(function(type,index){
    //         var resolution = auncher_resolutions[index.toString()];
    //         var resized = resize_image.resize(normalImage,resolution.width,resolution.height,resize_image.PNG);
    //         fs.writeFileSync(path.join(launchers_path,"mipmap-"+type+"hdpi","ic_launcher.png"),resized);
    //     })
    // }

    // circularImage.onload = function(){
    //     launcher_types.forEach(function(type,index){
    //         var resolution = auncher_resolutions[index.toString()];
    //         var resized = resize_image.resize(circularImage,resolution.width,resolution.height,resize_image.PNG);
    //         fs.writeFileSync(path.join(launchers_path,"mipmap-"+type+"hdpi","ic_launcher_round.png"),resized);
    //     })
    // }

}
function makeJavaSource(packageName){
    var packageToPath = packageName.split(".").join("/");
    var javaPath = path.join(__dirname,"../resources/android/app/src/main/java",packageToPath);
    fs.emptyDirSync(javaPath);
    fs.mkdirpSync(javaPath);
    fs.copySync(path.join(__dirname,"../resources/java"),javaPath);
    var wai = path.join(javaPath,"WebAppInterface.java");
    var maj = path.join(javaPath,"MainActivity.java");

    fs.writeFileSync(wai,fs.readFileSync(wai).toString("utf-8").replace(/{{PACKAGE_NAME}}/g,packageName));
    fs.writeFileSync(maj,fs.readFileSync(maj).toString("utf-8").replace(/{{PACKAGE_NAME}}/g,packageName))
}
function makeManifestXML/*package*/(packageName){
    var dom = new xml.DOMParser();
    var manifestPath = path.join(__dirname,"../resources/android/app/src/main/AndroidManifest.xml");
    var stringsDomContent = dom.parseFromString(fs.readFileSync(manifestPath).toString("utf-8"),"text/xml");
    var arr = stringsDomContent.documentElement.getElementsByTagName("manifest")._node.attributes;
    
    for(var m=0;m<arr.length;m++){
        if(arr[m].name == "package"){
            arr[m].value = packageName;
        }
    }

    var ser = new xml.XMLSerializer();
    
    var ts = ser.serializeToString(stringsDomContent);
    
    // console.log(packageName)
    // console.log(ts)

    fs.writeFileSync(manifestPath,ts);
}
function makeStringXML(){
    var dom = new xml.DOMParser();
    var stringsDomContent = dom.parseFromString(fs.readFileSync(path.join(valuesPath,"strings.xml")).toString("utf-8"),"text/xml");
    var arr = stringsDomContent.documentElement.getElementsByTagName("string");
    for(var i = 0;i<arr.length; i++){
        var n = arr[i].getAttribute("name");
    
        if(n == "app_name"){
            // console.log(arr[i].lastChild.data)
            arr[i].lastChild.data = getManifest().android.app_name;
        }
    }
    
    var ser = new xml.XMLSerializer();
    
    var ts = ser.serializeToString(stringsDomContent);
    
    // console.log(ts)

    fs.writeFileSync(path.join(valuesPath,"strings.xml"),ts);
}

function makeColorsXML(){
    var dom = new xml.DOMParser();
    var stringsDomContent = dom.parseFromString(fs.readFileSync(path.join(valuesPath,"colors.xml")).toString("utf-8"),"text/xml");
    var arr = stringsDomContent.documentElement.getElementsByTagName("color");
    for(var i = 0;i<arr.length; i++){
        var n = arr[i].getAttribute("name");
    
        if(n == "colorPrimary"){
            // console.log(arr[i].lastChild.data)
            arr[i].lastChild.data = getManifest().android.color.primary;
        }else if(n == "colorPrimaryDark"){
            arr[i].lastChild.data = getManifest().android.color.primaryDark;
        }else if(n == "colorAccent"){
            arr[i].lastChild.data = getManifest().android.color.accent;
        }
    }
    
    var ser = new xml.XMLSerializer();
    
    var ts = ser.serializeToString(stringsDomContent);

    // console.log(ts)

    fs.writeFileSync(path.join(valuesPath,"colors.xml"),ts);
}

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
    if(fs.existsSync(directory))fs.removeSync(directory);
    fs.mkdirSync(directory);
    var wjsManifest = `{
    "project-type" : "${type}",
    "compileCommand" : "${projectDefinitions[type].compileCommand?projectDefinitions[type].compileCommand:"webpack"}",
    "root": "${projectDefinitions[type].serverRoot?projectDefinitions[type].serverRoot:"www"}",
    "extraModules": []
}`;
    var wjsDefaultModules = projectDefinitions[type].defaultModules;

    // fs.writeFileSync(path.join(directory,"wjs-config.json"),wjsManifest);
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
    if(flag.vue){
        fs.copySync(path.join(__dirname,"../resources","vue"),path.join(directory))
    }else if(flag.react){
        console.log(chalk.yellow("This might take a while"))
        fs.copySync(path.join(__dirname,"../resources","wjs-react"),path.join(directory))
        fs.copySync(path.join(__dirname,"../resources/js/refresh.js"),path.join(directory,"src/refresh.js"))
    }else{
        fs.copySync(path.join(__dirname,"../resources","jsconfig.rsrc.json"),path.join(directory,"app","jsconfig.json"))
        var customHtml = fs.readFileSync(path.join(__dirname,"../resources","dev-index.html")).toString("utf-8")
        fs.writeFileSync(path.join(directory,"www","index.html"),customHtml);
        fs.copySync(path.join(__dirname,"../resources","js"),path.join(directory,"www","js"))
        fs.copySync(path.join(__dirname,"../resources","styles"),path.join(directory,"www","css"))
        fs.copySync(path.join(__dirname,"../resources","fonts"),path.join(directory,"www","fonts"))
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

function quietCompile(cb){
    console.log("Compiling....")
    getProjectDependencies(process.cwd())
    var manifest = getManifest();
    var compile = exec(manifest.compileCommand);
    compile.stdout.on("end",() => {
        cb()
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
            if(fs.existsSync(path.join(modulesPath,operand.split(".")[1],"module.conf"))){
                var conf = parseConf(path.join(modulesPath,operand.split(".")[1],"module.conf"));
                var package = require(path.join(__dirname,"../package.json"));
                // console.log(package)
                if(package["last-update"] != conf.requires){
                    var updateVersion = "update-"+package.version.replace(/\./g,"-");
                    console.log(chalk.red("Error : This feature update requires "+chalk.yellow(conf.requires.split("updates."+updateVersion+"_")[1].split("").join("."))+" already installed but you have "+package["last-update"]));
                    process.exit(9);
                }
            }
            require(path.join(modulesPath,operand.split(".")[1],"install.js"))
            console.log("Cleaning Up...");
            fs.removeSync(modulePath);
            console.log("Successfully installed "+operand)
            self.Then(undefined,modulePath);
            fs.emptyDir(path.join(__dirname,"../modules"));
        }

        fs.emptyDirSync(modulesPath);
    })

    return self;
}

function parseConf(file){
    var contents = fs.readFileSync(file).toString("utf-8");

    /*kvm means Key-Value-Map*/
    var kvm = {};

    var a = contents.split("\n");
    a.forEach(function(kv){
        /*kva means Key-Value-Array*/
        var kva = kv.split("=");
        var key = kva[0].trim();
        var value = kva[1].trim();
        kvm[key] = value;
    })

    return kvm;
}

function build(){
    var f = flags();
    var cwd = process.cwd();
    var p = cwd.split("\\");
    if(f.android){
        console.log(chalk.green("Building for Android"));
        if(typeof getManifest().android === "undefined"){
            console.log(chalk.red("Error : Android configuration not found\n\nCheck the readme at https://github.com/neutrino2211/webjs for how to make an android configuration"));
            process.exit(9);
        }
        makeStringXML();
        makeColorsXML();
        makeJavaSource(getManifest().android.package);
        makeGradleBuild(getManifest().android.package);
        makeManifestXML(getManifest().android.package);
        makeApplicationIcons(getManifest().android);

        fs.copySync(path.join(cwd,getManifest().root),path.join(resourcesPath,"android/app/src/main/assets/www"))
        var outputPath = path.join(resourcesPath,"android/app/build/outputs/apk/app-debug.apk");
        process.chdir(path.join(resourcesPath,"android"));
        var gradlew;

        switch (os.platform()) {
            case "win32":
                gradlew = "gradlew"
                break;
        
            default:
                gradlew = "./gradlew"
                break;
        }
        var p = cwd.split("\\");
        var gradle = exec(`${gradlew} assembleDebug`);
        var err;
        if(f.verbose){
            gradle.stdout.on("data",function(data){
                process.stdout.write(data.toString())
            })
        }

        gradle.stderr.once("error",function(data){
            print(chalk.red("Error initializing gradle"))
            process.exit(10);
        })

        function getApp(){
            process.chdir(cwd);
            // fs.moveSync(outputPath,path.join(cwd,path.dirname(cwd)+".apk"));
            var p = cwd.split("\\");
            if(!fs.existsSync(outputPath)){
                print(chalk.red("Error initializing gradle"))
                process.exit(10);
            }
            fs.renameSync(outputPath,path.join(cwd,p[p.length-1]+".apk"));
        }

        gradle.stdout.on("end",function(){
            if(err){
                console.log(chalk.red("Error:\n\n")+err)
                process.chdir(cwd);
            }else{
                getApp()
                var p = cwd.split("\\");
                var appPath = path.join(cwd,p[p.length-1]+".apk");
                console.log(chalk.green("App ready at "+appPath))
                // if(!f.release){
                //     console.log("\nTo make a release APK run "+chalk.grey("wjs build --android --release"))
                // }else{
                //     console.log(chalk.green("\nPackaging apk as release"));
                //     var pa = "keytool";
                //     var js = "jarsigner";
                    
                //     if(os.platform() == "win32"){
                //         pa = "C:/Program Files/Java"
                //         var installs = fs.readdirSync(pa).sort();
                //         var latestInstall = installs[installs.length -1]
                //         var latestInstallPath = path.join(pa,latestInstall);
                //         var pa = path.join(latestInstallPath,"bin/keytool.exe");

                //         var jdks = installs.filter(function(v){
                //             if(v.startsWith("jdk")){
                //                 return v;
                //             }
                //         }).sort();

                //         var latestJDKInstall = jdks[jdks.length-1];
                //         // console.log(jdks);
                //         js = path.join("C:/Program Files/Java",latestJDKInstall,"bin/jarsigner.exe");
                //     }
                
                //     // console.log(pa);

                //     var androidManifest = getManifest().android;

                //     if(fs.existsSync(path.join(process.cwd(),androidManifest.app_name+".keystore"))){
                //         fs.removeSync(path.join(process.cwd(),androidManifest.app_name+".keystore"));
                //     }

                //     // var p = process.cwd().split("\\");

                //     var sign_apk_path = path.join(__dirname,"../resources/sign/dist/sign.jar");

                //     var $exec = require("child_process");

                //     var $process = $exec.execSync("java -jar "+sign_apk_path+" \""+path.join(process.cwd(),p[p.length-1])+".apk\" --override");

                //     console.log($process.toString("utf-8"))
                // }
            }
            // console.log(process.cwd())
            var javaPath = path.join(__dirname,"../resources/android/app/src/main/java",getManifest().android.package.split(".").join("/"));
            fs.emptyDirSync(javaPath);
        })
    }else{
        console.log(chalk.green("App static files ready at "+path.join(cwd,getManifest().root)))
    }
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
        add: "wjs add <module>",
        init: "wjs init <App-name> <option>\noptions:\n\t--javascript\n\t--typescript\n\t--vue",
        update: "wjs update <version?>\nIf you need to install a specific version, run \n wjs update --version=<update-version>",
        "check-update": "wjs check-update",
        install : "wjs install <module>"
    }
    if(name == "*"){
        print("Usage:")
        Object.getOwnPropertyNames(commands).forEach((c)=>{
            print(commands[c]);
        })
    }else{
        print("Usage:\n"+commands[name]);
    }
}

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
var chalk              = require("chalk");
var server             = require("../resources/server");
var package            = require("../package.json");
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
        if(flags().version){
            ver = "updates."+updateVersion+"_"+flags().version.split(".").join("");
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
                    if(flags().version == undefined){
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

    var pack = JSON.parse(json);

    var updateVersion = "update-"+pack.version.replace(/\./g,"-");

    // console.log(pack["last-update"],"updates."+updateVersion+"_");

    console.log("Version : "+pack.version+"\nCurrent update : "+pack["last-update"].split("updates."+updateVersion+"_")[1].split("").join("."));
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
                console.log(" "+err);
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
    }else if(manifest["project-type"] == "react"){
        server.Source = path.join(process.cwd(),"build");
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

    var destinationZip = path.join(process.cwd(),operand+".zip");

    zip.addLocalFolder(path.join(process.cwd(),operand));
    
    zip.writeZip(destinationZip);

    // var config = {
    //     apiKey: "AIzaSyAougIsV_kErs5sk9ZzbTZFX2EaTIlucaI",
    //     authDomain: "webjs-f76df.firebaseapp.com",
    //     databaseURL: "https://webjs-f76df.firebaseio.com",
    //     projectId: "webjs-f76df",
    //     storageBucket: "webjs-f76df.appspot.com",
    //     messagingSenderId: "404258524081"
    // };
    // var app = firebase.initializeApp(config);
    var term = require("terminal-kit").terminal;
    var gcs = require('@google-cloud/storage');
    // print("Publishing "+chalk.green(operand))
    process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname,'../gcloud.json');
    var storage = gcs({
        projectId: 'webjs-f76df',
        keyFileName: path.join(__dirname,'../gcloud.json')
    });

    var Progress = term.progressBar({
        width: 80,
        title: "Publishing module",
        eta: true,
        percent: true
    });

    var bucket = storage.bucket("webjs-f76df.appspot.com");
    var upload = bucket.upload(destinationZip,{destination: "updates/"+operand},function(e,f){
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

    // var file = bucket.file("updates/"+operand);

    // fs.createReadStream(destinationZip)
    // .pipe(file.createWriteStream())
    // .on("data",function(data){
    //     console.log(data);
    // })
    // .on("finish",function(){
    //     Progress.update(100);
    //     print(chalk.green("Published "+operand))
    //     process.exit(0)
    // })
    // .on("error",function(err){
    //     print(chalk.red(""+err))
    //     process.exit(11)
    // })

    // print(upload)
    
    // var stream = bucket.file("updates/"+operand+".zip").createWriteStream({
    //     metadata:{
    //         contentType: "application/x-zip-compressed"
    //     }
    // });

    // stream.end(buf);

    Progress.update(0);

    // // var task = storageRef.put(buf,{
    // //     contentType: "application/x-zip-compressed"
    // // })

    // stream.on("state_changed",function(snapshot){
    //     var progress = (snapshot.bytesTrasferred / snapshot.totalBytes) * 100;
    //     Progress.update(progress);
    // }, function(err){
    //     print(chalk.red(""+err))
    // },function(){
    //     print(chalk.grren("Published "+operand))
    //     process.exit()
    // })
}

else if(operation == "build"){
    quietCompile(build);
}

else if(operation == "-h" || operation == "--help" || operation == "help"){
    usage("*");
}

else {
    usage("*");
}