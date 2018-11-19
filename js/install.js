const fs        = require("fs-extra");
const path      = require("path");
// const changeDir = require("./utils").changeDir;
const parseConf = require("./utils").parseConf;
const definitions = require("./proj-def");

function install(operand){
    return new Promise(function(res,rej){
        const wjsModule = operand.split(".").join("/")
    
        const adm_zip = require("adm-zip");

        const modulesPath = path.join(__dirname,"../../modules")
        const modulePath = path.join(modulesPath,operand+".zip")
        const keyFilepath = path.join(__dirname,'../../gcloud.json');
        var moduleFolderPath = modulePath.slice(0,modulePath.length-4);
        var gcs = require('@google-cloud/storage').Storage
        process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilepath
        var storage = new gcs({
            projectId: 'webjs-f76df',
            keyFileName: keyFilepath
        });
        var bucket = storage.bucket("webjs-f76df.appspot.com");
        console.log("Downloading...")
        bucket.file(wjsModule+".zip").download({
            destination: modulePath
        },(err)=>{
            if (err){
                // console.log(err)
                rej(err)
                fs.removeSync(modulePath);
            }else{
                console.log("Download complete")
                // fs.emptyDirSync(resourcePath)
                var zip = new adm_zip(modulePath);
                console.log("Unpacking...")
                zip.extractAllTo(moduleFolderPath,true)
                console.log("Installing...")
                // console.log(path.join(moduleFolderPath,"module.conf"))
                if(fs.existsSync(path.join(moduleFolderPath,"module.conf"))){
                    var conf = parseConf(path.join(moduleFolderPath,"module.conf"));
                    var package = require(path.join(__dirname,"../../package.json"));
                    // console.log(package)
                    if(conf.requires && package["last-update"] != conf.requires){
                        var updateVersion = "update-"+package.version.replace(/\./g,"-");
                        console.log(chalk.red("Error : This download requires update version "+chalk.yellow(conf.requires.split("updates."+updateVersion+"_")[1].split("").join("."))+" already installed but you have "+package["last-update"]));
                        process.exit(9);
                    }

                    if(conf.type === "task"){
                        package["wjs:installedModules"][conf.name] = path.join(moduleFolderPath,conf.engine);
                        // console.log(package)
                        fs.writeFileSync(path.join(__dirname,"../../package.json"),JSON.stringify(package,undefined,"\t"));
                    }else if(conf.type === "module-java"){
                        fs.renameSync(moduleFolderPath,path.join(__dirname,"../../resources/java/modules",wjsModule));
                    }else if(conf.type === "module-js"){
                        fs.renameSync(moduleFolderPath,path.join(definitions.javascript.modulesPath,wjsModule));
                    }else if(conf.type === "module-ts"){
                        fs.renameSync(moduleFolderPath,path.join(definitions.typescript.modulesPath,wjsModule));
                    }else if(conf.type === "module-rx"){
                        fs.renameSync(moduleFolderPath,path.join(definitions.react.modulesPath,wjsModule));
                    }else if(conf.type === "module-vue"){
                        fs.renameSync(moduleFolderPath,path.join(definitions.vue.modulesPath,wjsModule));
                    }
                }
                console.log("Cleaning Up...");
                fs.removeSync(modulePath);
                console.log("Successfully installed "+operand)
                res(modulePath);
            }
        })
    })
}

module.exports = function Install(operand){
    return install(operand)
}
