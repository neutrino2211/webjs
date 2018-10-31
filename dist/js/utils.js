var print = console.log;
//Imports
var os = require("os");
var fs = require("fs-extra");
var xml = require("xmldom");
var cwd = process.cwd();
var args = process.argv.slice(2, process.argv.length);
var path = require("path");
var exec = require("child_process").exec;
var chalk = require("chalk");
var resize_image = require("resize-img");
var resourcesPath = path.join(__dirname, "../../resources");
var valuesPath = path.join(resourcesPath, "android/app/src/main/res/values");
var projectDefinitions = require("./proj-def");
var Parcel = require("parcel");
/**
 * @argument {Array<String>} args
 * @description Turn command line options into an object.
 */
exports.flags = function (args) {
    var FLAGS = [];
    var map = {};
    (args || process.argv).forEach(function (f) {
        if (f.startsWith("--")) {
            FLAGS.push(f);
        }
    });
    FLAGS.forEach(function (f) {
        if (f.indexOf("=") > 0) {
            var v = f.slice(2).split("=")[1];
            if (v.startsWith('"') && v.endsWith('"')) {
                v = v.slice(1, v.length - 2);
            }
            map[f.slice(2).split("=")[0]] = v;
        }
        else {
            map[f.slice(2)] = true;
        }
    });
    return map;
};
/**
 * @argument {Object} flags
 * @description Use the flags object to detect what project is wjs-cli preparing
 */
exports.mode = function (flags) {
    if (flags.typescript) {
        return "typescript";
    }
    else if (flags.angular) {
        return "angular";
    }
    else if (flags.vue) {
        return "vue";
    }
    else if (flags.react) {
        return "react";
    }
    else if (flags.flame) {
        return "flame";
    }
    else {
        return "javascript";
    }
};
/**
 * @argument {String} directory
 * @description Write development index.html to allow hot-reload.
 */
exports.writeDev = function (directory) {
    fs.writeFileSync(path.join(directory, "www", "index.html"), fs.readFileSync(path.join(resourcesPath, "dev-index.html")).toString("utf-8"));
};
/**
 * @argument {String} directory
 * @description Write production index.html which does not contain hot reload
 */
exports.writePro = function (directory) {
    fs.writeFileSync(path.join(directory, "www", "index.html"), fs.readFileSync(path.join(resourcesPath, "index.html")).toString("utf-8"));
};
/**
 * @argument {String} name
 * @description Print the usage of a command or print the usage of all commands if "*" is specified
 */
exports.usage = function (name) {
    var commands = {
        add: "wjs add <module>\n\t - Add any installed module to current project",
        init: "wjs init <App-name> <option>\n\t - Initialize a project of the option type\n\t - options:\n\t\t --javascript\n\t\t --typescript\n\t\t --react\n\t\t --vue",
        update: "wjs update <version?>\n\t - If you need to install a specific version, run \n\t - wjs update --version=<update-version>",
        "check-update": "wjs check-update\n\t - Check if there are nightly updates or patches",
        install: "wjs install <module>\n\t - Install third party module",
        tasks: "wjs tasks\n\t - List task runners installed",
        run: "wjs run <task-alias>\n\t - run " + chalk.green("wjs tasks") + " to see installed task runners",
        development: "wjs run development\n\t - Run the code compiler in watch mode",
        build: "wjs build <platform?>\n\t - Compiles the code into a website if no target platform is specified\n\t - Supported platforms\n\t\t -> Android"
    };
    if (name == "*") {
        print("Usage:");
        Object.getOwnPropertyNames(commands).forEach(function (c) {
            print(commands[c]);
        });
    }
    else if (commands[name] == undefined) {
        print(chalk.red("No argument called '" + name + "'"));
    }
    else {
        print("Usage:\n" + commands[name]);
    }
};
/**
 * @return {Array<String>}
 * @description Get the list of all current wjs modules used by a project
 */
exports.getModules = function () {
    return fs.readdirSync(path.join(process.cwd(), "webjs_modules"));
};
/**
 * @argument {String} Manifest
 * @description Convert a configuration object to JSON and write it to "wjs-config.json"
 */
exports.makeManifest = function (Manifest) {
    fs.writeFileSync(path.join(process.cwd(), "wjs-config.json"), JSON.stringify(Manifest, undefined, "\t"));
};
/**
 *
 * @returns {{}} Object representation of manifest or the default "wjs-config.json" if the project has no manifest
 */
exports.getManifest = function (cwd) {
    if (!cwd) {
        cwd = process.cwd();
    }
    if (fs.existsSync(path.join(cwd, "wjs-config.json"))) {
        return JSON.parse(fs.readFileSync(path.join(cwd, "wjs-config.json")).toString("utf-8"));
    }
    else {
        return { "project-type": "javascript", compileCommand: "webpack", extraModules: [] };
    }
};
/**
 * @argument {String} directory
 * @description Get all non-module dependencies and package in the build directory
 */
exports.getProjectDependencies = function (directory) {
    //Get any extra uncompiled items to the final folder for dynamic referencing
    var arr = exports.getManifest().include;
    if (arr && Array.isArray(arr)) {
        for (var i = 0; i < arr.length; i++) {
            fs.copySync(path.join(directory, "app", arr[i]), path.join(directory, "www", arr[i]));
        }
    }
    var man = exports.getManifest();
    var type = man["project-type"];
    //Copy all wjsModules needed for the build
    man.extraModules.forEach(function (m) {
        fs.copySync(path.join(projectDefinitions[type].modulesPath, m), path.join(directory, "webjs_modules", m));
    });
};
/**
 * @argument {String} file
 * @description Parse configuration of a module
 */
exports.parseConf = function (file) {
    var contents = fs.readFileSync(file).toString("utf-8");
    /*kvm means Key-Value-Map*/
    var kvm = {};
    var a = contents.replace(/\\r/g, "").split("\n");
    a.forEach(function (kv) {
        if (!kv.trim().startsWith("#")) {
            /*kva means Key-Value-Array*/
            var kva = kv.split("=");
            var key = kva[0].trim();
            var value = kva[1].trim();
            if (value[0] == "%") {
                var aa = value.slice(1).split(",");
                value = [];
                aa.forEach(function (aaa) {
                    value.push(aaa.trim());
                });
            }
            kvm[key] = value;
        }
    });
    return kvm;
};
/**
 * @argument {String} extension
 * @description Return extension of project files based on current project type
 */
exports.extensions = function (extension) {
    if ("typescript" == extension) {
        return ".ts";
    }
    else if ("vue" == extension) {
        return ".js";
    }
    else if ("angular" == extension) {
        return ".ts";
    }
    else if ("react" == extension) {
        return ".jsx";
    }
    else {
        return ".js";
    }
};
/**
 * @argument {String} packageName
 * @description Get gradle build configuration of default android wjs wrapper project
 */
exports.makeGradleBuild = function (packageName) {
    var androidProjectDirectory = path.join(resourcesPath, "android");
    if (exports.getManifest().local === true)
        androidProjectDirectory = path.join(process.cwd(), "android");
    var gradle_build_path = path.join(androidProjectDirectory, "app/build.gradle");
    var resource_gradle_build_path = path.join(resourcesPath, "/java/build.gradle");
    fs.writeFileSync(gradle_build_path, fs.readFileSync(resource_gradle_build_path).toString("utf-8").replace(/{{PACKAGE_NAME}}/g, packageName));
};
/**
 * @argument {{local:Boolean,app_name:String,package:String,color:{accent:String,primary:String,primaryDark:String}}} androidManifest
 * @description Convert specified image in android section of project configuration to Android specified icon sizes
 */
exports.makeApplicationIcons = function (androidManifest) {
    var normalImagePath;
    var circularImagePath;
    var androidProjectDirectory = path.join(resourcesPath, "android");
    if (androidManifest.local === true)
        androidProjectDirectory = path.join(process.cwd(), "android");
    //If no icons are specified then use default android icons else use those included
    if (!androidManifest.icons) {
        console.log(chalk.yellow("Warning: no image files specified for " + androidManifest.app_name));
        normalImagePath = path.join(resourcesPath, "/java/ic_launcher.png");
        circularImagePath = path.join(resourcesPath, "/java/ic_launcher_round.png");
    }
    else {
        normalImagePath = path.join(process.cwd(), androidManifest.icons.normal);
        circularImagePath = path.join(process.cwd(), androidManifest.icons.circular);
    }
    var launchers_path = path.join(androidProjectDirectory, "app/src/main/res");
    var launcher_types = ["h", "m", "xh", "xxh", "xxxh"];
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
    launcher_types.forEach(function (type, index) {
        //Get needed resolution for this image based on it's index
        var resolution = launcher_resolutions[index.toString()];
        //Resize it and save it with it's size description  ["h","m","xh","xxh","xxxh"]
        resize_image(new Buffer(fs.readFileSync(normalImagePath)), resolution).then(function (buffer) {
            fs.writeFileSync(path.join(launchers_path, "mipmap-" + type + "dpi", "ic_launcher.png"), buffer);
        }).catch(function (err) {
            console.log(chalk.red("" + err));
        });
        //Resize it and save it with it's size description  ["h","m","xh","xxh","xxxh"] and specify as round        
        resize_image(new Buffer(fs.readFileSync(circularImagePath)), resolution).then(function (buffer) {
            fs.writeFileSync(path.join(launchers_path, "mipmap-" + type + "dpi", "ic_launcher_round.png"), buffer);
        }).catch(function (err) {
            console.log(chalk.red("" + err));
        });
    });
};
/**
 * @argument {Array<String>} moduleList
 * @description Return object of all modules with their exported functions
 * @returns {}
 */
function getWJSNativeModules(moduleList) {
    var javaModules = path.join(resourcesPath, "java", "modules");
    var modules = {};
    moduleList.forEach(function (e) {
        var modulePath = path.join(javaModules, e);
        //Parse module configuration into object
        var config = exports.parseConf(path.join(modulePath, "module.conf"));
        modules[config.name] = {
            "exports": config.exports,
            "dependencies": config.dependencies
        };
    });
    return modules;
}
/**
 * @argument {String} packageName
 * @description Get the Android app Java source code ready for compilation
 */
exports.makeJavaSource = function (packageName, local, p) {
    var androidProjectDirectory = path.join(resourcesPath, "android");
    if (local === true)
        androidProjectDirectory = path.join((p ? p : process.cwd()), "android");
    var packageToPath = packageName.split(".").join("/");
    var javaPath = path.join(androidProjectDirectory, "app/src/main/java", packageToPath);
    fs.removeSync(path.join(androidProjectDirectory, "app/src/main/java"));
    fs.mkdirpSync(javaPath);
    fs.copySync(path.join(resourcesPath, "/java"), javaPath);
    fs.removeSync(path.join(androidProjectDirectory, "app/src/main/java", packageToPath, "modules"));
    var used_modules = exports.getManifest().android.extraModules === undefined ? [] : exports.getManifest().android.extraModules;
    //Code declaration
    var extraModulesCode = "";
    //Code import
    var extraModulesImports = "";
    //Code initialization
    var extraModulesImportsInitialization = "";
    var modules = getWJSNativeModules(used_modules);
    Object.getOwnPropertyNames(modules).forEach(function (k) {
        fs.copySync(path.join(resourcesPath, "java", "modules", k, k + ".java"), path.join(androidProjectDirectory, "app/src/main/java/wjs/modules/", k + ".java"));
        extraModulesImports += "import wjs.modules." + k + ";\n"; //e.g import wjs.modules.Camera
        var className = k;
        var jsName = k[0].toLowerCase() + k.slice(1); //Give it a javascript-ish name e.g fomr CameraModule to cameraModule
        extraModulesCode += className + " " + jsName + ";\n\t"; // CameraModule cameraModule;
        /*
        @JavascriptInterface
        public Object getCameraModule(){
            cameraModule = new CameraModule(c);//c for Context
        }
        */
        extraModulesImportsInitialization += "@JavascriptInterface\n\tpublic Object get" + className + "(){\n\t\t" + jsName + " = new " + className + "(c);\n\t\treturn " + jsName + ";\n\t}";
    });
    var wai = path.join(javaPath, "WebAppInterface.java");
    var maj = path.join(javaPath, "MainActivity.java");
    //Replace all instances of placeholders with their respective content
    var mod_wai = fs.readFileSync(wai).toString("utf-8").
        replace(/{{PACKAGE_NAME}}/g, packageName).
        replace(/{{Dependencies}}/g, extraModulesImports).
        replace(/{{EXTRA_IMPORTS_DECLARATION}}/g, extraModulesCode).
        replace(/{{EXTRA_IMPORTS_INITIALIZATION}}/g, extraModulesImportsInitialization);
    //Write files
    fs.writeFileSync(wai, mod_wai);
    fs.writeFileSync(maj, fs.readFileSync(maj).toString("utf-8").replace(/{{PACKAGE_NAME}}/g, packageName));
};
/**
 * @argument {String} packageName
 * @description Generate AndroidManifest.xml file
 */
exports.makeManifestXML = function (packageName) {
    var androidProjectDirectory = path.join(resourcesPath, "android");
    var manifest = exports.getManifest();
    //If the android project is within the wjs project folder then use that instead
    if (manifest.local === true)
        androidProjectDirectory = path.join(process.cwd(), "android");
    //Init XML DOM parser
    var dom = new xml.DOMParser();
    var manifestPath = path.join(resourcesPath, "java/AndroidManifest.xml");
    var stringsDomContent = dom.parseFromString(fs.readFileSync(manifestPath).toString("utf-8"), "text/xml");
    //Get the attributes of the <manifest> tag
    var arr = stringsDomContent.documentElement.getElementsByTagName("manifest")._node.attributes;
    for (var m = 0; m < arr.length; m++) {
        //Set the package attribute to the packageName supplied.
        if (arr[m].name == "package") {
            arr[m].value = packageName;
        }
    }
    //If the android app has specific permissions then add them to the new AndroidManifest.xml
    if (Array.isArray(manifest.android.permissions)) {
        console.log(chalk.blue("Found specified permissions"));
        var permissions = manifest.android.permissions;
        permissions.forEach(function (permission) {
            var per = stringsDomContent.createElement("uses-permission");
            per.setAttribute("android:name", "android.permission." + permission.toUpperCase());
            stringsDomContent.documentElement.appendChild(per);
        });
    }
    ////If the android app has specific features then add them to the new AndroidManifest.xml
    if (Array.isArray(manifest.android.features)) {
        console.log(chalk.blue("Found specified features"));
        var features = manifest.android.features;
        features.forEach(function (feature) {
            var per = stringsDomContent.createElement("uses-feature");
            per.setAttribute("android:name", "android." + feature);
            stringsDomContent.documentElement.appendChild(per);
        });
    }
    var ser = new xml.XMLSerializer();
    //Convert xml DOM to string and write it to the new AndroidManifest.xml
    var ts = ser.serializeToString(stringsDomContent);
    fs.writeFileSync(path.join(androidProjectDirectory, "app/src/main/AndroidManifest.xml"), ts);
};
/**
 * @description Generate strings.xml file
 */
exports.makeStringXML = function () {
    var androidProjectDirectoryValues = valuesPath;
    var manifest = exports.getManifest();
    //If the android project is within the wjs project folder then use that instead
    if (manifest.local === true)
        androidProjectDirectoryValues = path.join(process.cwd(), "android/app/src/main/res/values");
    var dom = new xml.DOMParser();
    var stringsDomContent = dom.parseFromString(fs.readFileSync(path.join(androidProjectDirectoryValues, "strings.xml")).toString("utf-8"), "text/xml");
    var arr = stringsDomContent.documentElement.getElementsByTagName("string");
    for (var i = 0; i < arr.length; i++) {
        var n = arr[i].getAttribute("name");
        //Change the app_name attribute to manifest.app_name value
        if (n == "app_name") {
            arr[i].lastChild.data = manifest.android.app_name;
        }
    }
    var ser = new xml.XMLSerializer();
    //Convert xml DOM to string and write it
    var ts = ser.serializeToString(stringsDomContent);
    fs.writeFileSync(path.join(androidProjectDirectoryValues, "strings.xml"), ts);
};
/**
 * @description Generate colors.xml file
 */
exports.makeColorsXML = function () {
    var androidProjectDirectoryValues = valuesPath;
    var manifest = exports.getManifest();
    //If the android project is within the wjs project folder then use that instead
    if (manifest.local === true)
        androidProjectDirectoryValues = path.join(process.cwd(), "android/app/src/main/res/values");
    var dom = new xml.DOMParser();
    var stringsDomContent = dom.parseFromString(fs.readFileSync(path.join(androidProjectDirectoryValues, "colors.xml")).toString("utf-8"), "text/xml");
    //Get attributes of the <color> tag
    var arr = stringsDomContent.documentElement.getElementsByTagName("color");
    for (var i = 0; i < arr.length; i++) {
        var n = arr[i].getAttribute("name");
        //Set the <color> tag values based on their names
        if (n == "colorPrimary") {
            arr[i].lastChild.data = manifest.android.color ? manifest.android.color.primary : "#000000";
        }
        else if (n == "colorPrimaryDark") {
            arr[i].lastChild.data = manifest.android.color ? manifest.android.color.primaryDark : "#000000";
        }
        else if (n == "colorAccent") {
            arr[i].lastChild.data = manifest.android.color ? manifest.android.color.accent : "#000000";
        }
    }
    var ser = new xml.XMLSerializer();
    //Convert xml DOM to string and write it
    var ts = ser.serializeToString(stringsDomContent);
    fs.writeFileSync(path.join(androidProjectDirectoryValues, "colors.xml"), ts);
};
/**
 *
 * @param {TerminalKit} t
 * @param {String} question
 * @param {Function} cb
 * @description Prompt user for input using TerminalKit
 */
function ask(t, question, cb) {
    t(question);
    t.inputField({}, function (e, i) {
        if (e) {
            console.log(e);
            process.exit(1);
        }
        cb(i);
    });
}
/**
 * @argument {String} directory
 * @argument {Object} flag
 * @description Initialize wjs project
 */
exports.init = function (directory, flag) {
    var type = exports.mode(flag);
    var config = projectDefinitions[type].config;
    //If the path already exists then remove it
    if (fs.existsSync(directory)) {
        fs.removeSync(directory);
    }
    ;
    fs.mkdirSync(directory);
    var wjsManifest = "{\n    \"project-type\" : \"" + type + "\",\n    \"root\": \"" + (projectDefinitions[type].serverRoot ? projectDefinitions[type].serverRoot : "www") + "\",\n    \"local\": " + (flag.local ? true : false) + "," + (flag.package ? '\n\t"custom" : true,' : "") + (projectDefinitions[type].entry ? '\n\t"entry":"' + projectDefinitions[type].entry + '",' : "") + "\n    \"extraModules\": []\n}";
    var wjsDefaultModules = projectDefinitions[type].defaultModules;
    if (config) {
        fs.writeFileSync(path.join(directory, "webpack.config.js"), config);
    }
    //Include all default modules for the project
    wjsDefaultModules.forEach(function (m) {
        fs.copySync(path.join(projectDefinitions[type].modulesPath, m), path.join(directory, "webjs_modules", m));
    });
    //Get starter code relevant to project type
    if (flag.vue) {
        fs.copySync(path.join(resourcesPath, "wjs-vue"), path.join(directory));
    }
    else if (flag.react) {
        fs.copySync(path.join(resourcesPath, "wjs-react"), path.join(directory));
    }
    else if (flag.javascript) {
        fs.copySync(path.join(resourcesPath, "wjs-javascript"), path.join(directory));
    }
    else if (flag.typescript) {
        fs.copySync(path.join(resourcesPath, "wjs-typescript"), path.join(directory));
    }
    else {
        exports.usage("*");
        process.exit(0);
    }
    //Prepare package.json
    var pjson = JSON.parse(fs.readFileSync(path.join(directory, "package.json")).toString());
    console.log(chalk.magenta("Please answer these questions to continue with the setup"));
    var t = require("terminal-kit").terminal;
    ask(t, chalk.green("Author: "), function (i) {
        pjson.author = i;
        console.log();
        ask(t, chalk.green("Version: "), function (i) {
            pjson.version = i;
            console.log("\nMaking package.json");
            fs.writeFileSync(path.join(directory, "package.json"), JSON.stringify(pjson, undefined, "\t"));
            t.processExit();
        });
    });
    var a = directory.split(path.sep);
    pjson.name = a[a.length - 1];
    var beautifiedConfig = JSON.stringify(JSON.parse(wjsManifest), undefined, "\t");
    beautifiedConfig.compileCommand = undefined;
    //Generate standard Java code for Android project if the project is to have custom android files 
    if (flag.local === true) {
        if (flag.package) {
            exports.makeJavaSource(flag.package, true, directory);
            exports.makeGradleBuild(flag.package);
            exports.makeManifestXML(flag.package);
        }
        fs.copySync(path.join(resourcesPath, "android"), path.join(directory, "android"));
    }
    //Write wjs configuration file
    fs.writeFileSync(path.join(directory, "wjs-config.json"), beautifiedConfig);
};
/**
 * @argument {Number} position
 */
exports.checkArg = function (position) {
    if (!args[position]) {
        throw new TypeError("Error at argument (" + position + ") expected [STRING] found [NULL]");
    }
};
/**
 * @argument {String} dir
 */
exports.changeDir = function (dir) {
    process.chdir(dir);
};
exports.refresh = function (c) {
    if (c) {
        c.send("refresh");
    }
    else {
        console.log("Open " + chalk.blue.bold("http://localhost:" + global.port) + " to enable hot reload");
    }
};
/**
 * @argument {websocket.Socket.connnection} c
 */
exports.compile = function (cb, o) {
    exports.getProjectDependencies(process.cwd());
    var manifest = exports.getManifest(process.cwd());
    // console.log(notCompiling)
    if (global.notCompiling) {
        global.notCompiling = false;
        var bundler = new Parcel(manifest.entry, o);
        if (manifest["project-type"] === "react" && cb == undefined)
            process.env.NODE_ENV = "development";
        bundler.bundle()
            .then(function () {
            console.log(chalk.green("Done"));
            global.notCompiling = true;
            if (cb) {
                bundler.stop();
                cb();
            }
            ;
        })
            .catch(function (e) {
            console.log("Error compiling:");
            console.log(e);
            if (cb)
                cb(e);
            process.exit(2);
        });
    }
};
/**
 * @description Clean up residual Android build files
 */
function cleanUpAndroid() {
    var javaPath = path.join(resourcesPath, "/android/app/src/main/java");
    var assetsPath = path.join(resourcesPath, "/android/app/src/main/assets");
    fs.emptyDirSync(javaPath);
    fs.emptyDirSync(assetsPath);
}
/**
 * @description Build the android app
 * @param {String} cwd
 * @param {Object} f
 */
function buildAndroid(cwd, f) {
    var manifest = exports.getManifest();
    var androidProjectDirectory = path.join(resourcesPath, "android");
    //If manifest.local is true the the android source resides in <project-dir>/android
    if (manifest.local === true)
        androidProjectDirectory = path.join(process.cwd(), "android");
    console.log(chalk.green("Building for Android" + (manifest.local ? " (Local Project)" : "")));
    //Check for the existence of the android configuration in the manifest and exit if it does not
    if (typeof manifest.android === "undefined") {
        console.log(chalk.red("Error : Android configuration not found\n\nCheck the readme at https://github.com/neutrino2211/webjs for how to make an android configuration"));
        process.exit(9);
    }
    //Generate the colors.xml and string.xml files for the Android app
    exports.makeStringXML();
    exports.makeColorsXML();
    if (manifest.custom) {
        console.log("Customized source code " + chalk.green("(active)"));
    }
    else {
        //Generate the Java source of the android project if manifest.custom is false meaning there is no custom java to load
        exports.makeJavaSource(manifest.android.package, manifest.local);
        console.log("Customized source code " + chalk.yellow("(inactive)"));
    }
    //Generate the build.gradle, AndroidManifest.xml and ApplicationIcons
    exports.makeGradleBuild(manifest.android.package);
    exports.makeManifestXML(manifest.android.package);
    exports.makeApplicationIcons(manifest.android);
    //If the --no-compile flag exists then just copy the html sources to the www folder else compile before copying
    if (f["no-compile"])
        fs.copySync(path.join(cwd, projectDefinitions[manifest["project-type"]].root), path.join(androidProjectDirectory, "app/src/main/assets/www"));
    else
        fs.copySync(path.join(cwd, manifest.root), path.join(androidProjectDirectory, "app/src/main/assets/www"));
    var outputPath = path.join(androidProjectDirectory, "app/build/outputs/apk/app-debug.apk");
    //Go to android project directory and get ready to build
    process.chdir(androidProjectDirectory);
    var gradlew;
    //Get gradlew command based on operating system
    switch (os.platform()) {
        case "win32":
            gradlew = "gradlew";
            break;
        default:
            gradlew = "./gradlew";
            break;
    }
    var p = cwd.split("\\");
    var gradle = exec(gradlew + " assembleDebug");
    var err;
    //Show command output if --verbose is set
    if (f.verbose) {
        gradle.stdout.on("data", function (data) {
            process.stdout.write(data.toString());
        });
    }
    //Exit on gradle error and clean up files
    gradle.stderr.once("error", function () {
        print(chalk.red("Error initializing gradle"));
        cleanUpAndroid();
        process.exit(10);
    });
    gradle.stderr.on("data", function (data) {
        process.stderr.write(data);
    });
    function getApp() {
        process.chdir(cwd);
        var p = cwd.split("\\");
        if (!fs.existsSync(outputPath)) {
            print(chalk.red("Error initializing gradle"));
            process.exit(10);
        }
        fs.renameSync(outputPath, path.join(cwd, p[p.length - 1] + ".apk"));
    }
    gradle.stdout.on("end", function () {
        if (err) {
            console.log(chalk.red("Error:\n\n") + err);
            process.chdir(cwd);
        }
        else {
            getApp();
            var p = cwd.split("\\");
            var appPath = path.join(cwd, p[p.length - 1] + ".apk");
            console.log(chalk.green("App ready at " + appPath));
            fs.removeSync(path.join(resourcesPath, "build/android"));
        }
        cleanUpAndroid();
    });
}
/**
 * @argument {Function} cb
 */
exports.quietCompile = exports.compile;
exports.build = function () {
    var manifest = exports.getManifest();
    var f = exports.flags();
    var cwd = process.cwd();
    var p = cwd.split("\\");
    process.env.NODE_ENV = "production";
    //If no compilation is needed proceed to building android or web
    if (f["no-compile"]) {
        if (f.android) {
            buildAndroid(cwd, f);
        }
        else {
            fs.copySync(path.join(cwd, projectDefinitions[manifest["project-type"]].root), path.join(cwd, manifest.root));
            console.log(chalk.green("App static files ready at " + path.join(cwd, manifest.root)));
        }
    }
    else {
        exports.quietCompile(function () {
            //If the --android flag exists then build for android else just compile the html
            if (f.android) {
                buildAndroid(cwd, f);
            }
            else {
                console.log(chalk.green("App static files ready at " + path.join(cwd, manifest.root)));
            }
        }, {
            minify: true,
            target: "browser",
            publicUrl: "./"
        });
    }
};
exports.compileAndRefresh = function (c) {
    console.log("Compiling....");
    // getProjectDependencies(process.cwd())
    var manifest = exports.getManifest();
    exports.compile();
    var cmp = exec(manifest.compileCommand);
    cmp.stdout.on("end", function () {
        console.log("App running in " + chalk.blue.bold("http://localhost:3100"));
        exports.refresh(c);
        // c.send("refresh")
        // cmp.kill()
        cmp.removeAllListeners();
    });
    cmp.stderr.on("data", function () {
        console.log("Error compiling");
        process.exit(2);
    });
};
//# sourceMappingURL=utils.js.map