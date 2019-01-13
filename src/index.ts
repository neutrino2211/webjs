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
.command(['build','b'],'Build project for production',{},()=>{
    confirmConfig()
    utils.build();
})
.example("wjs build","Build project for production")
.command(["init <name> [type]",'i <name> [type]'],"Create a new project",{},(args)=>{
    ['react','task','vue','javascript','typescript','angular'].indexOf(<string>args.type) > 1?
        init(args.name, process.cwd(),args.type):
        console.log(chalk.red("Error: '"+args.type+"' is not recognized as a project type"));
})
.example("wjs init cool-app react","Create a project called cool-app of type react")
.demandCommand(1, '')
.version(version())
.help("help")
.alias("h","help")
.demandCommand()
.epilog("Copyright 2019").argv;
/*
// init argument block
if (operation == "init"){
    init(operand,process.cwd(),flags)
}


//Install argument block

else if(operation == "install"){
    install(operand)
}


//Version argument block

else if(operation == "-v"){
    version()
}

//Add app dependency
else if(operation == "add"){
    add(operand,process.cwd())
}

//Development

else if(operation == "development"){
    development(flags);
}

else if(operation == "publish"){
    publish(operand,process.cwd(),flags)
}

else if(operation == "build"){
    utils.build();
}

else if(operation == "run"){
    run(operand,process.cwd(),flags);
}

else if(operation == "tasks"){
    var p = require(path.join(__dirname,"../../package.json"));
    var m = p["wjs:installedTasks"];
    var modules = Object.getOwnPropertyNames(m);
    if(modules.length == 0){
        console.log(chalk.red("No tasks installed"));
        process.exit()
    }
    modules.forEach(function(name){
        console.log(chalk.green(name)+chalk.yellow(" -> ")+chalk.blue(m[name]))
    })
}

else if(operation == "remove"){
    remove(operand)
}

else if(operation == "-h" || operation == "--help" || operation == "help"){
    if(operand == undefined){
        utils.usage("*");
    }else{
        utils.usage(operand)
    }
}

else if(operation == "test"){
    var cwd = process.cwd();
    var _operand = operand||"."
    if(!existsSync(_operand)) console.log(chalk.red("Can't find '"+path.dirname(_operand)+"'"));
    if(existsSync(path.join(cwd,_operand,"module.conf"))){
        var conf = utils.parseConf(path.join(_operand,"module.conf"))
        run(_operand,cwd,flags,path.join(cwd,_operand,conf.engine));
    } else if(existsSync(path.join(_operand,"wjs-config.json"))){
        utils.changeDir(_operand)
        var start = Date.now()
        var r=255,g=255,b=255;
        utils.quietCompile(function(e){
            var diff = Date.now()-start;
            if(diff > 10000){
                b = 0
            }
            if(diff > 20000){
                g = 0xaa
            }
            if(diff > 30000){
                g = 0
            }
            if(diff <= 10000){
                r = 0
                b = 0
            }
            console.log(chalk.rgb(r,g,b)(diff/1000+"s")+": Build "+(e==undefined?chalk.green("successfull"):chalk.red("failed")))
        },{
            watch: false,
            minify: true
        })
    } else {
        console.log("")
    }
}

else {
    utils.usage("*");
}*/