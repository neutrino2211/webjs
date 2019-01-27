#!/usr/bin/env node

import * as utils from "../js/utils";
import * as path from "path";
import chalk from "chalk";
import {
    development, 
    init,
    version,
} from "../js/wjs"
import * as yargs from "yargs";

function confirmConfig(){
    if (utils.getManifest() == undefined){
        console.log(`Project [${process.cwd()}] does not have a `+chalk.rgb(0xb9,0x30,0x22)("wjs-config")+" entry in package.json")
        console.log("Did you forget to run 'wjs init' ?")
        process.exit()
    }
}

yargs.usage("Usage: wjs <command> [..options]")
.command(['dev','d'],'Compile files and wait for changes',{},(args)=>{
    confirmConfig()
    development(args);
})
.example("wjs dev","Compile files and wait for changes")
.command(['build','b'],'Build project for production',{},(args)=>{
    confirmConfig()
    utils.build(args);
})
.example("wjs build","Build project for production")
.command(["init <name>",'i <name>'],"Create a new project",{},(args)=>{
    true?
        init(args.name, process.cwd(),args):
        console.log(chalk.red("Error: '"+args.type+"' is not recognized as a project type"));
})
.example("wjs init cool-app --react","Create a project called cool-app of type react")
.command(["run <name>","r <name>"],'Run a wjs-task',{},(args)=>{
    var m = require(path.join(process.cwd(),"node_modules","wjs-task-"+(<string>args.name)));
    m(process.cwd(),args,utils)
})
// .demandCommand(1, '')
.command("$0",'start development server',{},(args)=>{
    confirmConfig()
    development(args)
})
.option("out-dir",{
    alias: "o",
    describe: "Output directory for builds"
})
.option("version",{
    alias: "v",
    describe: "Show version number"
})
.help("help")
.alias("h","help")
.demandCommand()
.epilog("Copyright 2019").argv;