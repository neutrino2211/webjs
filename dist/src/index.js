"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
var utils = require("../js/utils");
var path = require("path");
var wjs_1 = require("../js/wjs");
var Chalk = chalk.default;
console.log(chalk.default.green("Starting..."));
require("../js/wjs");
// init argument block
if (wjs_1.operation == "init") {
    wjs_1.init(wjs_1.operand, process.cwd(), wjs_1.flags);
}
//Update argument block
else if (wjs_1.operation == "update") {
    wjs_1.update(wjs_1.flags);
}
//Install argument block
else if (wjs_1.operation == "install") {
    wjs_1.install(wjs_1.operand);
}
//Version argument block
else if (wjs_1.operation == "-v") {
    wjs_1.version();
}
//Add app dependency
else if (wjs_1.operation == "add") {
    wjs_1.add(wjs_1.operand, process.cwd());
}
//Development
else if (wjs_1.operation == "run-dev" || wjs_1.operation == "development") {
    wjs_1.development(wjs_1.flags);
}
else if (wjs_1.operation == "check-update") {
    wjs_1.checkUpdate();
}
else if (wjs_1.operation == "publish") {
    wjs_1.publish(wjs_1.operand, process.cwd(), wjs_1.flags);
}
else if (wjs_1.operation == "build") {
    utils.build();
}
else if (wjs_1.operation == "run") {
    wjs_1.run(wjs_1.operand, process.cwd(), wjs_1.flags);
}
else if (wjs_1.operation == "tasks") {
    var p = require(path.join(__dirname, "../../package.json"));
    var m = p["wjs:installedModules"];
    var modules = Object.getOwnPropertyNames(m);
    if (modules.length == 0) {
        console.log(Chalk.red("No tasks installed"));
        process.exit();
    }
    modules.forEach(function (name) {
        console.log(Chalk.green(name) + Chalk.yellow(" -> ") + Chalk.blue(m[name]));
    });
}
else if (wjs_1.operation == "-h" || wjs_1.operation == "--help" || wjs_1.operation == "help") {
    if (wjs_1.operand == undefined) {
        utils.usage("*");
    }
    else {
        utils.usage(wjs_1.operand);
    }
}
else {
    utils.usage("*");
}
//# sourceMappingURL=index.js.map