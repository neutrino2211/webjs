var path = require("path");
// var fs = require("fs");

// process.env.unpackResource(path.join(__dirname,"contents"),"Typescript");

// fs.readdirSync(path.join(__dirname,"contents")).forEach(function(file){
//     fs.copyFileSync(path.join(__dirname,"contents",file),path.join(process.RESOURCES_PATH,"Typescript",file))
// })
fs.copySync(path.join(__dirname,"contents"),path.join(process.RESOURCES_PATH,"Typescript"))