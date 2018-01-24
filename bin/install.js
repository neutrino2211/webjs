var fs        = require("fs-extra");
var path      = require("path");
var changeDir = require("./utils").changeDir;
var parseConf = require("./utils").parseConf;

module.exports = function Install(operand){
    var self = {};
    var wjsModule = operand.split(".").join("/")
    
    var adm_zip = require("adm-zip");

    var modulesPath = path.join(__dirname,"../modules")
    var modulePath = path.join(modulesPath,operand+".zip")
    var gcs = require('@google-cloud/storage');
    process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname,'../gcloud.json');
    var storage = gcs({
        projectId: 'webjs-f76df',
        keyFileName: path.join(__dirname,'../gcloud.json')
    });


    var bucket = storage.bucket("webjs-f76df.appspot.com");
    console.log("Downloading...")
    console.log(wjsModule+".zip")
    bucket.file(wjsModule+".zip").download({
        destination: modulePath
    },(err)=>{
        if (err){
            // console.log(err)
            fs.removeSync(modulePath);
            self.Then(err,undefined)
        }else{
            console.log("Download complete")
            // fs.emptyDirSync(resourcePath)
            var zip = new adm_zip(modulePath);
            console.log("Unpacking...")
            zip.extractAllTo(modulesPath,true)
            console.log("Installing...")
            if(fs.existsSync(path.join(modulesPath,operand.split(".")[1],"module.conf"))){
                var conf = parseConf(path.join(modulesPath,operand.split(".")[1],"module.conf"));
                var package = require(path.join(__dirname,"../package.json"));
                // console.log(package)
                if(conf.requires && package["last-update"] != conf.requires){
                    var updateVersion = "update-"+package.version.replace(/\./g,"-");
                    console.log(chalk.red("Error : This download requires update version "+chalk.yellow(conf.requires.split("updates."+updateVersion+"_")[1].split("").join("."))+" already installed but you have "+package["last-update"]));
                    process.exit(9);
                }

                if(conf.type === "module"){
                    package["wjs:installedModules"][conf.name] = path.join(modulesPath,operand.split(".")[1],conf.engine);
                    fs.writeFileSync(path.join(__dirname,"../package.json"),JSON.stringify(package,undefined,"\t"));
                }
            }
            if(fs.existsSync(path.join(modulesPath,operand.split(".")[1],"install.js")))
                require(path.join(modulesPath,operand.split(".")[1],"install.js"));
            console.log("Cleaning Up...");
            fs.removeSync(modulesPath);
            console.log("Successfully installed "+operand)
            self.Then(undefined,modulePath);
            fs.emptyDir(path.join(__dirname,"../modules"));
        }

        fs.emptyDirSync(modulesPath);
    })

    return self;
}
