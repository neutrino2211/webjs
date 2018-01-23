var print = console.log;

//Imports

var os                 = require("os");
var fs                 = require("fs-extra");
var xml                = require("xmldom");
var cwd                = process.cwd();
var args               = process.argv.slice(2,process.argv.length);
var path               = require("path");
var exec               = require("child_process").exec;
var chalk              = require("chalk");
var resize_image       = require("resize-img");
var resourcesPath      = path.join(__dirname,"../resources");
var valuesPath         = path.join(resourcesPath,"android/app/src/main/res/values");
var projectDefinitions = require("./proj-def");

exports.flags = function(){
    var FLAGS = [];
    var map = {};

    process.argv.forEach((f)=>{
        if(f.startsWith("--")){
            FLAGS.push(f);
        }
    })

    FLAGS.forEach((f)=>{
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

/**
 * @argument {Object} flags
 */

exports.mode = function(flags){
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

/**
 * @argument {String} directory
 */

exports.writeDev = function(directory){
    fs.writeFileSync(path.join(directory,"www","index.html"),fs.readFileSync(path.join(__dirname,"../resources","dev-index.html")).toString("utf-8"))
}

/**
 * @argument {String} directory
 */

exports.writePro = function(directory){
    fs.writeFileSync(path.join(directory,"www","index.html"),fs.readFileSync(path.join(__dirname,"../resources","index.html")).toString("utf-8"))
}

/**
 * @argument {String} name
 */

exports.usage = function(name){
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

/**
 * @return {Array<String>}
 */
exports.getModules = function(){
    return fs.readdirSync(path.join(process.cwd(),"webjs_modules"));
}

/**
 * @argument {String} Manifest
 */

exports.makeManifest = function(Manifest){
    fs.writeFileSync(path.join(process.cwd(),"wjs-config.json"),JSON.stringify(Manifest,undefined,"\t"));
}

/**
* @returns {Map<Object>}
*/
exports.getManifest = function(){
   var manifest;
   if(fs.existsSync(path.join(process.cwd(),"wjs-config.json"))){
       return JSON.parse(fs.readFileSync(path.join(process.cwd(),"wjs-config.json")).toString("utf-8"));   
   }else{
       return {"project-type":"javascript",compileCommand: "webpack",extraModules:[]};
   }
}

/**
 * @argument {String} directory
 */

exports.getProjectDependencies = function(directory){
    if(fs.pathExistsSync(path.join(directory,"app","pages"))){
        fs.copySync(path.join(directory,"app","pages"),path.join(directory,"www","pages"))
    }
    var man = exports.getManifest();
    var type = man["project-type"];
    
    man.extraModules.forEach((m)=>{
        fs.copySync(path.join(projectDefinitions[type].modulesPath,m),path.join(directory,"webjs_modules",m));
    })
}

/**
 * @argument {String} file
 */

exports.parseConf = function(file){
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

/**
 * @argument {String} extension
 */

exports.extensions = function(extension){
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

/**
 * @argument {String} packageName
 */

exports.makeGradleBuild = function(packageName){
    var androidProjectDirectory = path.join(resourcesPath,"android");

    if(exports.getManifest().local === true)androidProjectDirectory = path.join(process.cwd(),"android");

    var gradle_build_path = path.join(androidProjectDirectory,"app/build.gradle");
    var resource_gradle_build_path = path.join(__dirname,"../resources/java/build.gradle");
    fs.writeFileSync(gradle_build_path,fs.readFileSync(resource_gradle_build_path).toString("utf-8").replace(/{{PACKAGE_NAME}}/g,packageName));
}

/**
 * @argument {{local:Boolean,app_name:String,package:String,color:{accent:String,primary:String,primaryDark:String}}} androidManifest
 */

exports.makeApplicationIcons = function(androidManifest){
    var normalImagePath;
    var circularImagePath;
    
    var androidProjectDirectory = path.join(resourcesPath,"android");

    if(androidManifest.local === true)androidProjectDirectory = path.join(process.cwd(),"android");

    if(!androidManifest.icons){
        console.log(chalk.yellow("Warning: no image files specified for "+androidManifest.app_name));
        // process.exit(8);
        normalImagePath = path.join(__dirname,"../resources/java/ic_launcher.png");
        circularImagePath = path.join(__dirname,"../resources/java/ic_launcher_round.png");
    }else{
        normalImagePath = path.join(process.cwd(),androidManifest.icons.normal);
        circularImagePath = path.join(process.cwd(),androidManifest.icons.circular);
    }

    var launchers_path = path.join(androidProjectDirectory,"app/src/main/res"); 
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
            console.log(chalk.red(""+err));
        });

        resize_image(new Buffer(fs.readFileSync(circularImagePath)),resolution).then(function(buffer){
            fs.writeFileSync(path.join(launchers_path,"mipmap-"+type+"dpi","ic_launcher_round.png"),buffer);
        }).catch(function(err){
            console.log(chalk.red(""+err));
        });
    })    

}

/**
 * @argument {String} packageName
 */

exports.makeJavaSource = function(packageName){
    var androidProjectDirectory = path.join(resourcesPath,"android");

    if(exports.getManifest().local === true)androidProjectDirectory = path.join(process.cwd(),"android");

    var packageToPath = packageName.split(".").join("/");
    var javaPath = path.join(androidProjectDirectory,"app/src/main/java",packageToPath);
    fs.emptyDirSync(javaPath);
    fs.mkdirpSync(javaPath);
    fs.copySync(path.join(__dirname,"../resources/java"),javaPath);
    var wai = path.join(javaPath,"WebAppInterface.java");
    var maj = path.join(javaPath,"MainActivity.java");

    fs.writeFileSync(wai,fs.readFileSync(wai).toString("utf-8").replace(/{{PACKAGE_NAME}}/g,packageName));
    fs.writeFileSync(maj,fs.readFileSync(maj).toString("utf-8").replace(/{{PACKAGE_NAME}}/g,packageName))
}

/**
 * @argument {String} packageName
 */

exports.makeManifestXML = function/*package*/(packageName){
    var androidProjectDirectory = path.join(resourcesPath,"android");

    if(exports.getManifest().local === true)androidProjectDirectory = path.join(process.cwd(),"android");

    var dom = new xml.DOMParser();
    var manifestPath = path.join(androidProjectDirectory,"app/src/main/AndroidManifest.xml");
    var stringsDomContent = dom.parseFromString(fs.readFileSync(manifestPath).toString("utf-8"),"text/xml");
    var arr = stringsDomContent.documentElement.getElementsByTagName("manifest")._node.attributes;
    
    for(var m=0;m<arr.length;m++){
        if(arr[m].name == "package"){
            arr[m].value = packageName;
        }
    }

    var ser = new xml.XMLSerializer();
    
    var ts = ser.serializeToString(stringsDomContent);

    fs.writeFileSync(manifestPath,ts);
}

exports.makeStringXML = function(){
    var androidProjectDirectoryValues = valuesPath;

    if(exports.getManifest().local === true)androidProjectDirectoryValues = path.join(process.cwd(),"android/app/src/main/res/values");

    var dom = new xml.DOMParser();
    var stringsDomContent = dom.parseFromString(fs.readFileSync(path.join(androidProjectDirectoryValues,"strings.xml")).toString("utf-8"),"text/xml");
    var arr = stringsDomContent.documentElement.getElementsByTagName("string");
    for(var i = 0;i<arr.length; i++){
        var n = arr[i].getAttribute("name");
    
        if(n == "app_name"){
            // console.log(arr[i].lastChild.data)
            arr[i].lastChild.data = exports.getManifest().android.app_name;
        }
    }
    
    var ser = new xml.XMLSerializer();
    
    var ts = ser.serializeToString(stringsDomContent);
    
    // console.log(ts)

    fs.writeFileSync(path.join(androidProjectDirectoryValues,"strings.xml"),ts);
}

exports.makeColorsXML = function(){
    var androidProjectDirectoryValues = valuesPath;

    if(exports.getManifest().local === true)androidProjectDirectoryValues = path.join(process.cwd(),"android/app/src/main/res/values");

    var dom = new xml.DOMParser();
    var stringsDomContent = dom.parseFromString(fs.readFileSync(path.join(androidProjectDirectoryValues,"colors.xml")).toString("utf-8"),"text/xml");
    var arr = stringsDomContent.documentElement.getElementsByTagName("color");
    for(var i = 0;i<arr.length; i++){
        var n = arr[i].getAttribute("name");
    
        if(n == "colorPrimary"){
            arr[i].lastChild.data = exports.getManifest().android.color.primary;
        }else if(n == "colorPrimaryDark"){
            arr[i].lastChild.data = exports.getManifest().android.color.primaryDark;
        }else if(n == "colorAccent"){
            arr[i].lastChild.data = exports.getManifest().android.color.accent;
        }
    }
    
    var ser = new xml.XMLSerializer();
    
    var ts = ser.serializeToString(stringsDomContent);

    fs.writeFileSync(path.join(androidProjectDirectoryValues,"colors.xml"),ts);
}

/**
 * @argument {String} directory
 */

exports.init = function(directory){
    var flag = exports.flags();
    var type = exports.mode(flag);
    var config = projectDefinitions[type].config;
    if(fs.existsSync(directory))fs.removeSync(directory);
    fs.mkdirSync(directory);
    var wjsManifest = `{
    "project-type" : "${type}",
    "compileCommand" : "${projectDefinitions[type].compileCommand?projectDefinitions[type].compileCommand:"webpack"}",
    "root": "${projectDefinitions[type].serverRoot?projectDefinitions[type].serverRoot:"www"}",
    "local": "${flag.local?true:false}",
    "extraModules": []
}`;
    var wjsDefaultModules = projectDefinitions[type].defaultModules;
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
    wjsDefaultModules.forEach((m)=>{
        fs.copySync(path.join(projectDefinitions[type].modulesPath,m),path.join(directory,"webjs_modules",m));
    })
    if(flag.vue){
        fs.copySync(path.join(__dirname,"../resources","vue"),path.join(directory))
    }else if(flag.react){
        fs.copySync(path.join(__dirname,"../resources","wjs-react"),path.join(directory))
        fs.copySync(path.join(__dirname,"../resources/js/refresh.js"),path.join(directory,"app/refresh.js"))
    }else{
        fs.copySync(path.join(__dirname,"../resources","jsconfig.rsrc.json"),path.join(directory,"app","jsconfig.json"))
        var customHtml = fs.readFileSync(path.join(__dirname,"../resources","dev-index.html")).toString("utf-8")
        fs.writeFileSync(path.join(directory,"www","index.html"),customHtml);
        fs.copySync(path.join(__dirname,"../resources","js"),path.join(directory,"www","js"))
        fs.copySync(path.join(__dirname,"../resources","styles"),path.join(directory,"www","css"))
        fs.copySync(path.join(__dirname,"../resources","fonts"),path.join(directory,"www","fonts"))
    }

    if(flag.local === true){
        fs.copySync(path.join(__dirname,"../resources","android"),path.join(directory,"android"));
    }
    fs.writeFileSync(path.join(directory,"wjs-config.json"),wjsManifest);
    
}

/**
 * @argument {Number} position
 */

exports.checkArg = function(position){
    if(!args[position]){
        throw new TypeError("Error at argument ("+position+") expected [STRING] found [NULL]")
    }
}

/**
 * @argument {String} dir
 */

exports.changeDir = function(dir){
    process.chdir(dir)
}
exports.refresh = function(c){
    if(c){
        c.send("refresh")
    }else{
        console.log(`Open ${chalk.blue.bold("http://localhost:3100")} to enable hot reload`);
    }
}

// console.log(flags());

/**
 * @argument {websocket.Socket.connnection} c
 */

exports.compile = function(c){
    console.log("Compiling....")
    exports.getProjectDependencies(process.cwd())
    var manifest = exports.getManifest();
    var compile = exec(manifest.compileCommand);
    compile.stdout.on("end",() => {
        console.log("App running in "+chalk.blue.bold("http://localhost:3100"))
        exports.refresh(c)
        compile.removeAllListeners()
    })
    compile.stderr.on("data",()=>{
        console.log("Error compiling");
        process.exit(2)
    })
}

/**
 * @argument {Function} cb
 */

exports.quietCompile = function(cb){
    console.log("Compiling....")
    exports.getProjectDependencies(process.cwd())
    var manifest = exports.getManifest();
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

exports.build = function(){
    var f = exports.flags();
    var cwd = process.cwd();
    var p = cwd.split("\\");
    if(f.android){
        var androidProjectDirectory = path.join(resourcesPath,"android");

        if(exports.getManifest().local === true)androidProjectDirectory = path.join(process.cwd(),"android");

        console.log(chalk.green("Building for Android"+(exports.getManifest().local?" (Local Project)":"")));
        if(typeof exports.getManifest().android === "undefined"){
            console.log(chalk.red("Error : Android configuration not found\n\nCheck the readme at https://github.com/neutrino2211/webjs for how to make an android configuration"));
            process.exit(9);
        }
        // fs.copySync(path.join(resourcesPath,"android"),path.join(resourcesPath,"build/android"));

        exports.makeStringXML();
        exports.makeColorsXML();
        if(exports.getManifest().custom == "undefined"){
            exports.makeJavaSource(exports.getManifest().android.package);
            console.log("Customized source code "+chalk.yellow("(inactive)"))
        }else{
            console.log("Customized source code "+chalk.green("(active)"))
        }
        exports.makeGradleBuild(exports.getManifest().android.package);
        exports.makeManifestXML(exports.getManifest().android.package);
        exports.makeApplicationIcons(exports.getManifest().android);

        fs.copySync(path.join(cwd,exports.getManifest().root),path.join(androidProjectDirectory,"app/src/main/assets/www"));
        var outputPath = path.join(androidProjectDirectory,"app/build/outputs/apk/app-debug.apk");
        process.chdir(androidProjectDirectory);
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

        gradle.stderr.on("data",function(data){
            process.stderr.write(data)
        })

        function getApp(){
            process.chdir(cwd);
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
                fs.removeSync(path.join(resourcesPath,"build/android"));
            }
            var javaPath = path.join(__dirname,"../resources/android/app/src/main/java",exports.getManifest().android.package.split(".").join("/"));
            fs.emptyDirSync(javaPath);
        })
    }else{
        console.log(chalk.green("App static files ready at "+path.join(cwd,exports.getManifest().root)))
    }
}

exports.compileAndRefresh = function(c){
    console.log("Compiling....")
    // getProjectDependencies(process.cwd())
    var manifest = exports.getManifest();
    exports.compile()
    var cmp = exec(manifest.compileCommand);
    cmp.stdout.on("end",() => {
        console.log("App running in "+chalk.blue.bold("http://localhost:3100"))
        exports.refresh(c)
        // c.send("refresh")
        // cmp.kill()
        cmp.removeAllListeners()
    })
    cmp.stderr.on("data",()=>{
        console.log("Error compiling");
        process.exit(2)
    })
}