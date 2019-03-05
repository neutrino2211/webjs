import * as fs from "fs-extra"
import chalk from "chalk";
import * as path from "path";
import { definitions as projectDefinitions } from "./proj-def";
import yargs = require("yargs");
import { Chain, Loader } from "./loader";

import * as inquirer from "inquirer"
import { changeDir, extensions } from "./utils";
import { exec, execSync, spawnSync, spawn } from "child_process";
import { promisify } from "util";

import { init as karmaInit } from "karma/lib/init"

const projectTypes = ["javascript","typescript","angular","vue","react"]
const resourcesPath = path.join(__dirname,"../resources");
const tasks = new Chain<Loader>((prev,next)=>{
    if(prev && prev.ora.isSpinning){
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
    }),
    new Loader({
        text: "Installing default packages"
    })
]

const questionsList = [
    {
        type: "confirm",
        name: "npm",
        message: "Run npm install after creating project?",
        default: true
    },
    {
        type: "confirm",
        name: "testing",
        message: "Do you want wjs to add "+chalk.green("Karma")+"?",
        default: false
    }
]

async function init(directory,type){
    if(fs.existsSync(directory)){
        var {removeDir} = await inquirer.prompt({
            type: "confirm",
            name: "removeDir",
            message: `Directory '${directory}' already exists, do yo want to remove it?`,
            default: false
        })
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
    tasks.finish()
}

async function continueWithQuestions(directory,_,args){
    const {npm, testing} = await inquirer.prompt(questionsList)
    var wjsManifest = `{
        "project-type" : "${_}",
        "root": "${projectDefinitions[_].serverRoot?projectDefinitions[_].serverRoot:"src/index.html"}",
        "entry": "${projectDefinitions[_].entry}"
    }`;
    //Prepare package.json
    let pjson = JSON.parse(fs.readFileSync(path.join(directory,"package.json")).toString())
    pjson = pjson = { devDependencies: pjson.devDependencies, dependencies: pjson.dependencies}
    var a = directory.split(path.sep);
    pjson.name = a[a.length-1]
    pjson["wjs-config"] = JSON.parse(wjsManifest)
    fs.writeFileSync(path.join(directory,"package.json"),JSON.stringify(pjson,undefined,"\t"))
    console.log(chalk.rgb(0x90,0xff,0x44)("Please answer these questions to continue with the setup"))
    const {version ,author, license} = await inquirer.prompt([
        {
            type: "input",
            name: "author",
            message: "Author: "
        },
        {
            type: "input",
            name: "version",
            message: "Version: "
        },
        {
            type: "input",
            name: "license",
            message: "License: ",
            default: "MIT"
        }
    ])
    tasks.next()
    pjson.author = author
    pjson.version = version
    pjson.license = license
    fs.writeFileSync(path.join(directory,"package.json"),JSON.stringify(pjson,undefined,"\t"))
    if(npm || testing){
        tasks.next()
        const asyncExec = promisify(exec)
        changeDir(directory)
        if(npm){
            const cmd = "npm install ";
            try {
                await asyncExec(cmd)
            } catch (error) {
                tasks.failed(error)
                process.exit()
            }
        }
    
        if(testing){
            tasks.current.ora.text = "Installing "+projectDefinitions[_].testPackages.join(' ')
            const cmd = 'npm install karma karma-chrome-launcher '+projectDefinitions[_].testPackages.join(' ')+' --save-dev'
            try{
                await asyncExec(cmd);
                tasks.current.ora.text = 'Installed packages'
                tasks.finish()
                karmaInit(args)
            } catch(e){
                tasks.failed(e);
                process.exit()
            }
        }
        !tasks.done && tasks.finish()
    }

    if(tasks.done && tasks.current.ora.isSpinning) {
        tasks.current.ora.text = 'Installed packages';
        tasks.finish()
    }
}

async function continueWithoutQuestions(directory,_){
    var wjsManifest = `{
        "project-type" : "${_}",
        "root": "${projectDefinitions[_].serverRoot?projectDefinitions[_].serverRoot:"src/index.html"}",
        "entry": "${projectDefinitions[_].entry}"
    }`;
    //Prepare package.json
    let pjson = JSON.parse(fs.readFileSync(path.join(directory,"package.json")).toString())
    pjson = { devDependencies: pjson.devDependencies, dependencies: pjson.dependencies}
    var a = directory.split(path.sep);
    pjson.name = a[a.length-1]
    pjson["wjs-config"] = JSON.parse(wjsManifest)
    fs.writeFileSync(path.join(directory,"package.json"),JSON.stringify(pjson,undefined,"\t"))
}

export const description = "Create a wjs project"

export const command = ["create <name> [type]","c <name> [type]"]

export function builder(yargs: yargs.Argv){
    return yargs.example("wjs create jsProject javascript","Create a javascript project called jsProject").option("yes",{
        alias: "y",
        type: "boolean",
        description: "Don't ask me questions, just continue"
    })
}

export async function handler(args){
    const directory = args.name;
    const _  = args.type || "javascript"
    await init(directory,args.type)
    if(args.yes){
        continueWithoutQuestions(directory,_)
    } else {
        continueWithQuestions(directory,_,args)
    }
}