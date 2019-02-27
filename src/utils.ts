//Imports
// var fs                 = require("fs-extra");
// var path               = require("path");
// var chalk              = require("chalk");
// var resourcesPath      = path.join(__dirname,"../../resources");
// var projectDefinitions = require("./proj-def");
// var Parcel = require("parcel")
import * as Parcel from "parcel";
import * as path from "path";
import * as fs from "fs-extra";
import chalk from "chalk";
import { load } from "cheerio";
import { definitions as projectDefinitions } from "./proj-def";


var resourcesPath = path.join(__dirname,"../resources");
/**
 * @argument {Array<String>} args
 * @description Turn command line options into an object.
 */

export function flags (args){
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

export function mode(flags){
    if(flags.typescript){
        return "typescript";
    }else if(flags.angular){
        return "angular";
    }else if(flags.vue){
        return "vue";
    }else if(flags.react){
        return "react";
    }else{
        return "javascript";
    }
}
/**
 * @argument {String} Manifest
 * @description Convert a configuration object to JSON and write it to "wjs-config.json" 
 */

export function makeManifest(Manifest){
    var pack = path.join(process.cwd(),"package.json")
    var pjson = JSON.parse(pack)
    pjson["wjs-config"] = Manifest
    fs.writeFileSync(pack,JSON.stringify(pjson,undefined,"\t"));
}

/**
 * @function confirmConfig
 */

export function confirmConfig(){
    if (getManifest() == undefined){
        console.log(`Project [${process.cwd()}] does not have a `+chalk.rgb(0xb9,0x30,0x22)("wjs-config")+" entry in package.json")
        console.log("Did you forget to run 'wjs init' ?")
        process.exit()
    }
}

export function confirmNative(){
    if(!fs.existsSync("./native")){
        console.log(`Project [${process.cwd()}] does not have a `+chalk.rgb(0xb9,0x30,0x22)("native")+" folder")
        console.log("Did you forget to run 'wjs native create' ?")
        process.exit()
    }
}

export function changeDir(dir){
    process.chdir(dir)
}

/**
 * 
 * @returns {{}} Object representation of manifest or the default "wjs-config.json" if the project has no manifest
 */
export function getManifest(){
    const cwd = process.cwd();
    if(fs.existsSync(path.join(cwd,"package.json"))){
        return JSON.parse(fs.readFileSync(path.join(cwd,"package.json")).toString("utf-8"))["wjs-config"]
    }else{
        console.log(chalk.red("Error: No wjs-config in package.json"))
        process.exit();
    }
}

/**
 * @argument {String} extension
 * @description Return extension of project files based on current project type
 */

export function extensions(extension){
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
 * 
 * @param {TerminalKit} t 
 * @param {String} question 
 * @param {Function} cb 
 * @description Prompt user for input using TerminalKit
 */
function ask(t,question,cb){

    t(question)

    t.inputField({},function(e,i){
        if(e){
            console.log(e);
            process.exit(1);
        }

        cb(i)
    })
}

export function _ask(t,q){
    t(q)
    return new Promise((res,rej)=>{
        t.inputField((e,r)=>{
            if(e){
                rej(e)
            } else {
                res(r)
            }
        })
    })
}

/**
 * @argument {String} directory
 * @argument {Object} flag
 * @description Initialize wjs project
 */

export function init(directory,type){
    //If the path already exists then remove it
    if(fs.existsSync(directory)){
        fs.removeSync(directory)
    };
    var _ = (type.react?"react":undefined)||
            (type.angular?"angular":undefined)||
            (type.vue?"vue":undefined)||
            (type.javascript?"javascript":undefined)||
            (type.typescript?"typescript":undefined)||
            (type.task?"task":undefined)||
            "javascript"
    fs.mkdirSync(directory);
    console.log(_)
    var wjsManifest = `{
    "project-type" : "${_}",
    "root": "${projectDefinitions[_].serverRoot?projectDefinitions[_].serverRoot:"src/index.html"}",
    "entry": "${projectDefinitions[_].entry}"
}`;

    //Get starter code relevant to project type
    fs.copySync(path.join(resourcesPath,"wjs-"+_),directory)
    if(_=="task"){
        fs.writeFileSync(
            path.join(directory,"module.conf"),
            "name = "+(
                    function(){
                        var l = directory.split(path.sep);
                        return l[l.length-1];
                    }()
                )+
            "\ntype = task\nengine = engine.js\nrequires = "+
            require(path.join(__dirname,"../package.json"))["last-update"]
        );
    }

    //Prepare package.json
    var pjson = JSON.parse(fs.readFileSync(path.join(directory,"package.json")).toString())
    var a = directory.split(path.sep);
    pjson.name = a[a.length-1]
    pjson["wjs-config"] = JSON.parse(wjsManifest)
    console.log(chalk.magenta("Please answer these questions to continue with the setup"))
    var t = require("terminal-kit").terminal;
    ask(t,chalk.green("Author: "),function(i){
        pjson.author = i;
        console.log()
        ask(t,chalk.green("Version: "),function(i){
            pjson.version = i
            console.log("\nMaking package.json")
            fs.writeFileSync(path.join(directory,"package.json"),JSON.stringify(pjson,undefined,"\t"))
            t.processExit()
        })
    })
}

/**
 * @argument {Function} c
 * @argument { {watch: Boolean?, minify: Boolean?} } o
 */

export function compile(cb,o){
    var manifest = getManifest()
    // process.env.NODE_ENV = o.watch?"development":"production";
    var bundler = new Parcel(path.join(process.cwd(),manifest.entry),o);
    bundler.bundle()
    .then(function(){
        if(cb){
            cb()
        };
    })
    .catch(function(e){
        console.log("Error compiling:");
        // console.log(e);
        if(cb) cb(e);
        process.exit(2)
    })
}

/**
 * @argument {Function} cb
 */

export const quietCompile = compile;
export function build(flags){
    const manifest = getManifest();
    var f = flags||flags();
    var cwd = process.cwd();
    process.env.NODE_ENV = "production"
    if(f["no-compile"]){
        fs.copySync(path.join(cwd,projectDefinitions[manifest["project-type"]].root),path.join(cwd,manifest.root))
        console.log(chalk.green("App static files ready at "+path.join(cwd,manifest.root)))
    } else {
        quietCompile(function(){
            console.log(chalk.green("App static files ready at "+path.join(cwd,manifest.root)))
        },{
            minify: true,
            target: "browser",
            publicUrl: "./",
            outDir: f.o||f.output||"./dist"
        });
    }
}

export function makeCordovaEntry(){
    const defaultEntry = fs.readFileSync("native/www/index.html").toString("utf-8");
    const $ = load(defaultEntry);
    var head = $("head").html();
    const newHead = `<!--
    Customize this policy to fit your own app's needs. For more guidance, see:
        https://github.com/apache/cordova-plugin-whitelist/blob/master/README.md#content-security-policy
    Some notes:
        * gap: is required only on iOS (when using UIWebView) and is needed for JS->native communication
        * https://ssl.gstatic.com is required only on Android and is needed for TalkBack to function properly
        * Disables use of inline scripts in order to mitigate risk of XSS vulnerabilities. To change this:
            * Enable inline JS: add 'unsafe-inline' to default-src
    -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;">
    <meta name="format-detection" content="telephone=no">
    <meta name="msapplication-tap-highlight" content="no">
    <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">`+head;
    $("head").html(newHead);

    var body = $("body").html()
    const newBody = `<script type="text/javascript" src="cordova.js"></script>`+body;
    $("body").html(newBody);
    fs.writeFileSync("native/www/index.html",$.html());
}

export function cleanNative(){
    fs.emptyDirSync("native/www")
}