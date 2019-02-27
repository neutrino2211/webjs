import * as path from "path";
import * as chalk from "chalk";
import * as fs from "fs-extra";
import * as utils from "./utils";
import projectDefinitions  from "./proj-def";

export function development(flags){
    var express  = require("express");
    var manifest = utils.getManifest();

    var SR /*server root*/  = projectDefinitions[manifest["project-type"]].serverRoot;
    var port = 3100;

    var app = express();
    if(flags.debug){
        var middleware = function(req,res,next){
            console.log(`Debug [${Date()}]: ${chalk.default.blue(req.url)}`)
            if(req.url.endsWith("/") && req.url != "/"){
                req.url = req.url.slice(0,-1)
            }
            next()
        }
        app.use(middleware)
    }
    app.use(express.static(flags.o||flags.output||SR))
    var l = app.listen(port);
    console.log("App is available on http://localhost:"+l.address().port)
    console.log("Watching "+manifest.entry)
    process.env.NODE_ENV = "development"
    utils.compile(undefined,{watch:"true",publicUrl:"./",contentHash:false,outDir:flags.o||flags.output||SR})

    if(flags.open){
        require('opn')('http://localhost:'+port);
    }
}

export function init(operand,cwd,type){
    console.log("Initializing app in "+path.join(process.cwd(),operand))
    utils.init(path.join(cwd,operand),type)
}

export function version(){
    var json = fs.readFileSync(path.join(__dirname,"../../","package.json")).toString();
    var pack = JSON.parse(json);
    return pack.version
}