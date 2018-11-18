import * as utils from "../js/utils";
import * as path from "path";
import chalk from "chalk";
import {
    operand, 
    operation, 
    development, 
    init, 
    install, 
    publish, 
    flags, 
    update,
    version,
    checkUpdate,
    run,
    add
} from "../js/wjs"
import { existsSync } from "fs";

console.log(chalk.green("Starting..."))
const proj_operations = ["add","development","build","run"]

if (!existsSync("./wjs-config.json") && proj_operations.indexOf(operation) > -1){
    console.log(`Project [${process.cwd()}] does not have a `+chalk.rgb(0xb9,0x30,0x22)("wjs-config.json"))
    console.log("Did you forget to run 'wjs init' ?")
    process.exit()
}
// init argument block

if (operation == "init"){
    init(operand,process.cwd(),flags)
}


//Update argument block

else if (operation == "update"){
    update(flags)
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

else if(operation == "check-update"){
    checkUpdate()
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
    var m = p["wjs:installedModules"];
    var modules = Object.getOwnPropertyNames(m);
    if(modules.length == 0){
        console.log(chalk.red("No tasks installed"));
        process.exit()
    }
    modules.forEach(function(name){
        console.log(chalk.green(name)+chalk.yellow(" -> ")+chalk.blue(m[name]))
    })
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
    if(!existsSync(operand)) console.log(chalk.red("Can't find '"+path.dirname(operand)+"'"));
    var conf = utils.parseConf(path.join(operand,"module.conf"))
    run(operand,cwd,flags,path.join(cwd,operand,conf.engine));
}

else {
    utils.usage("*");
}