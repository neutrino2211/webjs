//Greetings
var print = console.log;

//Declare variables
var fs                 = require("fs-extra");
var path               = require("path");
var utils              = require('./utils');
var chalk              = require("chalk");
var projectDefinitions = require("./proj-def");

function Development(flags){
    var express  = require("express");
    var manifest = utils.getManifest();

    var SR /*server root*/  = projectDefinitions[manifest["project-type"]].serverRoot;

    var port = 3100;

    global.flags = flags;
    global.port  = flags.port||port;

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
    var l = app.listen(global.port);
    console.log("App is available on http://localhost:"+l.address().port)
    console.log("Watching "+manifest.entry)
    process.env.NODE_ENV = "development"
    utils.compile(undefined,{watch:"true",publicUrl:"./",contentHash:false,outDir:flags.o||flags.output||SR})

    if(flags.open){
        require('opn')('http://localhost:'+port);
    }
}

function Init(operand,cwd,type){
    print("Initializing app in "+path.join(process.cwd(),operand))
    utils.init(path.join(cwd,operand),type)
}
function Version(){
    var json = fs.readFileSync(path.join(__dirname,"../../","package.json")).toString();

    var pack = JSON.parse(json);

    // console.log(pack["last-update"],"updates."+updateVersion+"_");

    return pack.version
}
exports.init        = Init;
exports.development = Development;
exports.version = Version;