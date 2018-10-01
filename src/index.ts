import * as chalk from "chalk";
import * as utils from "../js/utils"
import * as path from "path"
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

var Chalk = chalk.default;
console.log(chalk.default.green("Starting..."))

import "../js/wjs"

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

else if(operation == "run-dev" || operation == "development"){
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
        console.log(Chalk.red("No tasks installed"));
        process.exit()
    }
    modules.forEach(function(name){
        console.log(Chalk.green(name)+Chalk.yellow(" -> ")+Chalk.blue(m[name]))
    })
}

else if(operation == "-h" || operation == "--help" || operation == "help"){
    if(operand == undefined){
        utils.usage("*");
    }else{
        utils.usage(operand)
    }
}

else {
    utils.usage("*");
}