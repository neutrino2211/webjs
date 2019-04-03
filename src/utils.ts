import * as Parcel from "parcel";
import * as path from "path";
import * as fs from "fs-extra";
import chalk from "chalk";
import { load } from "cheerio";

export const apacheLicense = `<!--
Customize this policy to fit your own app's needs. For more guidance, see:
    https://github.com/apache/cordova-plugin-whitelist/blob/master/README.md#content-security-policy
Some notes:
    * gap: is required only on iOS (when using UIWebView) and is needed for JS->native communication
    * https://ssl.gstatic.com is required only on Android and is needed for TalkBack to function properly
    * Disables use of inline scripts in order to mitigate risk of XSS vulnerabilities. To change this:
        * Enable inline JS: add 'unsafe-inline' to default-src
-->`

export function makeManifest(newManifest){
    var pack = path.join(process.cwd(),"package.json")
    var pjson = JSON.parse(pack)
    pjson["wjs-config"] = newManifest
    fs.writeFileSync(pack,JSON.stringify(pjson,undefined,"\t"));
}

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

export function getManifest(){
    const cwd = process.cwd();
    if(fs.existsSync(path.join(cwd,"package.json"))){
        return JSON.parse(fs.readFileSync(path.join(cwd,"package.json")).toString("utf-8"))["wjs-config"]
    }else{
        return undefined
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
 * @argument {{}} options
 */

export function asyncCompile(options){
    var manifest = getManifest()
    var bundler = new Parcel(options.inputFile||path.join(process.cwd(),manifest.entry),options);
    bundler.bundle()
    return bundler
}

export function compile(options){
    var manifest = getManifest()
    var bundler = new Parcel(options.inputFile||path.join(process.cwd(),manifest.entry),options);
    return bundler.bundle()
}


export function makeCordovaEntry(){
    const defaultEntry = fs.readFileSync("native/www/index.html").toString("utf-8");
    const $ = load(defaultEntry);

    var body = $("body").html()
    const newBody = `<script type="text/javascript" src="cordova.js"></script>`+body;
    $("body").html(newBody);
    fs.writeFileSync("native/www/index.html",$.html());
}

export function makeCordovaEntryFromNative(){
    const defaultEntry = fs.readFileSync("www/index.html").toString("utf-8");
    const $ = load(defaultEntry);

    var body = $("body").html()
    const newBody = `<script type="text/javascript" src="cordova.js"></script>`+body;
    $("body").html(newBody);
    fs.writeFileSync("www/index.html",$.html());
}

export function cleanNative(){
    fs.emptyDirSync("native/www")
}