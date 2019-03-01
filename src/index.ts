#!/usr/bin/env node

import * as utils from "./utils";
import * as path from "path";
import chalk from "chalk";
import {
    development, 
    init,
    version,
} from "./wjs"
import * as yargs from "yargs";

yargs.usage("Usage: wjs <command> [..options]")
.command(['dev','d'],'Compile files and wait for changes',{},(args)=>{
    utils.confirmConfig()
    development(args);
})
.example("wjs dev","Compile files and wait for changes")
.command(['build','b'],'Build project for production',{},(args)=>{
    utils.confirmConfig()
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
.commandDir("./native")
// .demandCommand(1, '')
.command("$0",'Same as '+chalk.dim('wjs dev'),{},(args)=>{
    utils.confirmConfig()
    development(args)
})
.option("version",{
    alias: "v",
    describe: "Show version number"
})
.help("help")
.alias("h","help")
.demandCommand().argv;