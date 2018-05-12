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
var Parcel = require("parcel")

/**
 * @argument {Array<String>} args
 * @description Turn command line options into an object.
 */

exports.flags = function(args){
    var FLAGS = [];
    var map = {};

    (args||process.argv).forEach((f)=>{
        if(f.startsWith("--")){
            FLAGS.push(f);
        }
    })

    FLAGS.forEach((f)=>{
        if(f.indexOf("=") > 0){
            var v = f.slice(2).split("=")[1];
            if(v.startsWith('"') && v.endsWith('"')){
                v = v.slice(1,v.length-2);
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
 * @description Use the flags object to detect what project is wjs-cli preparing
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
 * @description Write development index.html to allow hot-reload.
 */

exports.writeDev = function(directory){
    fs.writeFileSync(path.join(directory,"www","index.html"),fs.readFileSync(path.join(__dirname,"../resources","dev-index.html")).toString("utf-8"))
}

/**
 * @argument {String} directory
 * @description Write production index.html which does not contain hot reload
 */

exports.writePro = function(directory){
    fs.writeFileSync(path.join(directory,"www","index.html"),fs.readFileSync(path.join(__dirname,"../resources","index.html")).toString("utf-8"))
}

/**
 * @argument {String} name
 * @description Print the usage of a command or print the usage of all commands if "*" is specified
 */

exports.usage = function(name){
    var commands = {
        add: "wjs add <module>\n\t - Add any installed module to current project",
        init: "wjs init <App-name> <option>\n\t - Initialize a project of the option type\n\t - options:\n\t\t --javascript\n\t\t --typescript\n\t\t --react\n\t\t --vue",
        update: "wjs update <version?>\n\t - If you need to install a specific version, run \n\t - wjs update --version=<update-version>",
        "check-update": "wjs check-update\n\t - Check if there are nightly updates or patches",
        install : "wjs install <module>\n\t - Install third party module",
        tasks: "wjs tasks\n\t - List task runners installed",
        run: "wjs run <task-alias>\n\t - run "+chalk.green("wjs tasks")+" to see installed task runners",
        development: "wjs run development\n\t - Run the code compiler in watch mode",
        build: "wjs build <platform?>\n\t - Compiles the code into a website if no target platform is specified\n\t - Supported platforms\n\t\t -> Android"
    }
    if(name == "*"){
        print("Usage:")
        Object.getOwnPropertyNames(commands).forEach((c)=>{
            print(commands[c]);
        })
    }else if(commands[name] == undefined){
        print(chalk.red(`No argument called '${name}'`))
    }else{
        print("Usage:\n"+commands[name]);
    }
}

/**
 * @return {Array<String>}
 * @description Get the list of all current wjs modules used by a project
 */
exports.getModules = function(){
    return fs.readdirSync(path.join(process.cwd(),"webjs_modules"));
}

/**
 * @argument {String} Manifest
 * @description Convert a configuration object to JSON and write it to "wjs-config.json" 
 */

exports.makeManifest = function(Manifest){
    fs.writeFileSync(path.join(process.cwd(),"wjs-config.json"),JSON.stringify(Manifest,undefined,"\t"));
}

/**
 * 
 * @returns {{}} Object representation of manifest or the default "wjs-config.json" if the project has no manifest
 */
exports.getManifest = function(cwd){

    if(!cwd){
        cwd = process.cwd();
    }

    var manifest;
    if(fs.existsSync(path.join(cwd,"wjs-config.json"))){
        return JSON.parse(fs.readFileSync(path.join(cwd,"wjs-config.json")).toString("utf-8"));   
    }else{
        return {"project-type":"javascript",compileCommand: "webpack",extraModules:[]};
    }
}

/**
 * @argument {String} directory
 * @description Get all non-module dependencies and package in the build directory
 */

exports.getProjectDependencies = function(directory){
    if(fs.pathExistsSync(path.join(directory,"app","assets"))){
        fs.copySync(path.join(directory,"app","assets"),path.join(directory,"www","assets"))
    }
    var arr = exports.getManifest().include;
    if(arr && Array.isArray(arr)){
        for(var i = 0; i<arr.length ; i++){
            fs.copySync(path.join(directory,"app",arr[i]),path.join(directory,"www",arr[i]))
        }
    }
    var man = exports.getManifest();
    var type = man["project-type"];
    
    man.extraModules.forEach((m)=>{
        fs.copySync(path.join(projectDefinitions[type].modulesPath,m),path.join(directory,"webjs_modules",m));
    })
}

/**
 * @argument {String} file
 * @description Parse configuration of a module
 */

exports.parseConf = function(file){
    var contents = fs.readFileSync(file).toString("utf-8");

    /*kvm means Key-Value-Map*/
    var kvm = {};

    var a = contents.split("\n");
    a.forEach(function(kv){
        if(!kv.trim().startsWith("#")){
            /*kva means Key-Value-Array*/
            var kva = kv.split("=");
            var key = kva[0].trim();
            var value = kva[1].trim();
            kvm[key] = value;
        }
    })

    return kvm;
}

/**
 * @argument {String} extension
 * @description Return extension of project files based on current project type
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
 * @description Get gradle build configuration of default android wjs wrapper project
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
 * @description Convert specified image in android section of project configuration to Android specified icon sizes
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
 * @description Get the Android app Java source code ready for compilation
 */

exports.makeJavaSource = function(packageName,local,p){
    var androidProjectDirectory = path.join(resourcesPath,"android");

    if(local === true)androidProjectDirectory = path.join((p?p:process.cwd()),"android");

    var packageToPath = packageName.split(".").join("/");
    var javaPath = path.join(androidProjectDirectory,"app/src/main/java",packageToPath);
    fs.removeSync(javaPath);
    fs.mkdirpSync(javaPath);
    fs.copySync(path.join(__dirname,"../resources/java"),javaPath);

    var used_modules = exports.getManifest().android.extraModules === undefined? [] : exports.getManifest().android.extraModules;
    var extraModulesCode = "";
    var extraModulesImports = "";
    used_modules.forEach(function(m){
        var c = fs.readFileSync(path.join(resourcesPath,"java","modules",m+".java"),"utf-8");
        extraModulesImports+=c.split("/*")[1].split("*/")[0]+"\n";
        extraModulesCode+=(c+"\n");
    })

    var wai = path.join(javaPath,"WebAppInterface.java");
    var maj = path.join(javaPath,"MainActivity.java");
    var mod_wai = fs.readFileSync(wai).toString("utf-8").replace(/{{PACKAGE_NAME}}/g,packageName).replace(/{{EXTRA_IMPORTS}}/g,extraModulesCode).replace(/{{Dependencies}}/g,extraModulesImports);
    fs.writeFileSync(wai, mod_wai);
    fs.writeFileSync(maj,fs.readFileSync(maj).toString("utf-8").replace(/{{PACKAGE_NAME}}/g,packageName))
}

/**
 * @argument {String} packageName
 */

exports.makeManifestXML = function/*package*/(packageName){
    var androidProjectDirectory = path.join(resourcesPath,"android");

    if(exports.getManifest().local === true)androidProjectDirectory = path.join(process.cwd(),"android");

    var dom = new xml.DOMParser();
    var manifestPath = path.join(resourcesPath,"java/AndroidManifest.xml");
    var stringsDomContent = dom.parseFromString(fs.readFileSync(manifestPath).toString("utf-8"),"text/xml");
    var arr = stringsDomContent.documentElement.getElementsByTagName("manifest")._node.attributes;
    
    for(var m=0;m<arr.length;m++){
        if(arr[m].name == "package"){
            arr[m].value = packageName;
        }
    }

    if(Array.isArray(exports.getManifest().android.permissions)){
        console.log(chalk.blue("Found specified permissions"))
        var permissions = exports.getManifest().android.permissions;

        permissions.forEach(function(permission){
            var per = stringsDomContent.createElement("uses-permission")
            per.setAttribute("android:name","android.permission."+permission.toUpperCase())
            stringsDomContent.documentElement.appendChild(per)
        })
    }


    if(Array.isArray(exports.getManifest().android.features)){
        console.log(chalk.blue("Found specified features"))
        var features = exports.getManifest().android.features;

        features.forEach(function(feature){
            // console.log(stringsDomContent.documentElement.getElementsByTagName("manifest")._node)
            var per = stringsDomContent.createElement("uses-feature")
            // per.
            per.setAttribute("android:name","android."+feature)
            stringsDomContent.documentElement.appendChild(per)
        })
    }

    var ser = new xml.XMLSerializer();
    
    var ts = ser.serializeToString(stringsDomContent);
    // console.log(ts);
    fs.writeFileSync(path.join(androidProjectDirectory,"app/src/main/AndroidManifest.xml"),ts);
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
            arr[i].lastChild.data = exports.getManifest().android.color?exports.getManifest().android.color.primary:"#000000";
        }else if(n == "colorPrimaryDark"){
            arr[i].lastChild.data = exports.getManifest().android.color?exports.getManifest().android.color.primaryDark:"#000000";
        }else if(n == "colorAccent"){
            arr[i].lastChild.data = exports.getManifest().android.color?exports.getManifest().android.color.accent:"#000000";
        }
    }
    
    var ser = new xml.XMLSerializer();
    
    var ts = ser.serializeToString(stringsDomContent);

    fs.writeFileSync(path.join(androidProjectDirectoryValues,"colors.xml"),ts);
}

/**
 * @argument {String} directory
 */

exports.init = function(directory,flag){
    // var flag = exports.flags();
    var type = exports.mode(flag);
    var config = projectDefinitions[type].config;
    if(fs.existsSync(directory))fs.removeSync(directory);
    fs.mkdirSync(directory);
    var wjsManifest = `{
    "project-type" : "${type}",
    "compileCommand" : "${projectDefinitions[type].compileCommand?projectDefinitions[type].compileCommand:"webpack"}",
    "root": "${projectDefinitions[type].serverRoot?projectDefinitions[type].serverRoot:"www"}",
    "local": ${flag.local?true:false},${flag.package?'\n\t"custom" : true,':""}${projectDefinitions[type].entry?'\n\t"entry":"'+projectDefinitions[type].entry+'",':""}
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
    
    if(projectDefinitions[type].entry  &&  projectDefinitions[type].config){
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
        fs.copySync(path.join(__dirname,"../resources","parcel-react-master"),path.join(directory))
        fs.copySync(path.join(__dirname,"../resources/js/refresh.js"),path.join(directory,"src/refresh.js"))
    }else{
        fs.copySync(path.join(__dirname,"../resources","jsconfig.rsrc.json"),path.join(directory,"app","jsconfig.json"))
        var customHtml = fs.readFileSync(path.join(__dirname,"../resources","dev-index.html")).toString("utf-8")
        fs.writeFileSync(path.join(directory,"www","index.html"),customHtml);
        fs.copySync(path.join(__dirname,"../resources","js"),path.join(directory,"www","js"))
        fs.copySync(path.join(__dirname,"../resources","styles"),path.join(directory,"www","css"))
        fs.copySync(path.join(__dirname,"../resources","fonts"),path.join(directory,"www","fonts"))
    }

    if(flag.local === true){
        if(flag.package){
            exports.makeJavaSource(flag.package,true,directory);
            exports.makeGradleBuild(flag.package);
            exports.makeManifestXML(flag.package);
        }
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
        console.log(`Open ${chalk.blue.bold("http://localhost:"+global.port)} to enable hot reload`);
    }
}

// console.log(flags());

/**
 * @argument {websocket.Socket.connnection} c
 */

exports.compile = function(c){
    // console.log("Compiling....")
    exports.getProjectDependencies(process.cwd())
    var manifest = exports.getManifest();
    if(manifest.compileCommand && global.notCompiling){
        global.notCompiling = false;
        if(manifest.compileCommand.startsWith("$")) manifest.compileCommand = global.BIN_PATH+"\\"+manifest.compileCommand.slice(1);
        // console.log("Using "+manifest.compileCommand+" to compile")
        var compile = exec(manifest.compileCommand);
        compile.stdout.on("end",() => {
            if(global.flags.hot){
                exports.refresh(c)
            }
            // console.log(chalk.green("success"))
            global.notCompiling = true;
            compile.removeAllListeners()
        })
        compile.stderr.on("data",()=>{
            console.log("Error compiling");
            process.exit(2)
        })
    }else if(manifest.compileCommand == undefined && global.notCompiling){
        global.notCompiling = false;
        var bundler = new Parcel(manifest.entry);
        bundler.hmr = false;
        if(manifest["project-type"] === "react") process.env.NODE_ENV = "development";
        bundler.bundle()
        .then(function(){
            console.log(chalk.green("Done"))
            global.notCompiling = true;
            // exports.refresh(c)
        })
        .catch(function(e){
            console.log("Error compiling:");
            console.log(e);
            process.exit(2)
        })
    }
}

/**
 * @argument {Function} cb
 */

exports.quietCompile = function(cb){
    console.log("Compiling....")
    exports.getProjectDependencies(process.cwd())
    var manifest = exports.getManifest();
    if(manifest.compileCommand.startsWith("$")) manifest.compileCommand = global.BIN_PATH+"\\"+manifest.compileCommand.slice(1);
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
        if(exports.getManifest().custom){
            console.log("Customized source code "+chalk.green("(active)"))
        }else{
            exports.makeJavaSource(exports.getManifest().android.package,exports.getManifest().local);
            console.log("Customized source code "+chalk.yellow("(inactive)"))
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
            var javaPath = path.join(__dirname,"../resources/android/app/src/main/java");
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