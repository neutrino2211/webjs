import * as fs from "fs-extra"
import chalk from "chalk";
import { _ask } from "./utils";
import * as path from "path";
import { terminal } from "terminal-kit";
import { definitions as projectDefinitions } from "./proj-def";
import yargs = require("yargs");
import { Chain, Loader } from "./loader";

const projectTypes = ["javascript","typescript","angular","vue","react"]
const resourcesPath = path.join(__dirname,"../resources");

const tasks = new Chain<Loader>((prev,next)=>{
    if(prev){
        prev.succeed()
    }
    next.start()
},(last)=>{
    last.succeed()
},list=>list.map(e=>e.fail()));

tasks.list = [
    new Loader({
        text: "Creating directory"
    }),
    new Loader({
        text: "Copying project template"
    }),
    new Loader({
        text: "Writing manifest"
    })
]

async function init(directory,type){
    if(fs.existsSync(directory)){
        var removeDir = await _ask(terminal,`Directory '${directory}' already exists, do yo want to remove it? [y/N]: `)
        removeDir = removeDir == "y" ? true : false;
        console.log()
        if(removeDir){
            fs.removeSync(directory)
        } else {
            process.exit()
        }
    };
    tasks.next()
    const _ = type || "javascript"
    if(projectTypes.indexOf(_)==-1){
        tasks.failed(new Error(`Invalid project type '${_}'`))
        process.exit()
    }
    fs.mkdirSync(directory);

    tasks.next()
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
}

export const description = "Create a wjs project"

export const command = ["create <name> [type]","c <name> [type]"]

export function builder(yargs: yargs.Argv){
    return yargs.example("wjs create jsProject javascript","Create a wjs project called jsProject of type javascript")
}

export async function handler(args){
    const directory = args.name;
    const _  = args.type || "javascript"
    await init(directory,args.type)
    tasks.next()
    var wjsManifest = `{
        "project-type" : "${_}",
        "root": "${projectDefinitions[_].serverRoot?projectDefinitions[_].serverRoot:"src/index.html"}",
        "entry": "${projectDefinitions[_].entry}"
    }`;
    //Prepare package.json
    var pjson = JSON.parse(fs.readFileSync(path.join(directory,"package.json")).toString())
    var a = directory.split(path.sep);
    pjson.name = a[a.length-1]
    pjson["wjs-config"] = JSON.parse(wjsManifest)
    fs.writeFileSync(path.join(directory,"package.json"),JSON.stringify(pjson,undefined,"\t"))
    tasks.finish()
    console.log(chalk.rgb(0x90,0xff,0x44)("Please answer these questions to continue with the setup"))
    const author = await _ask(terminal,chalk.blue("Author: "))
    console.log()
    const version = await _ask(terminal,chalk.blue("Version: "))
    pjson.author = author
    pjson.version = version
    console.log("\nMaking package.json")
    fs.writeFileSync(path.join(directory,"package.json"),JSON.stringify(pjson,undefined,"\t"))
    console.log("Done")
    terminal.processExit()
}