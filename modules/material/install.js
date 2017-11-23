var fs = require("fs-extra")
var path = require("path")

fs.renameSync(path.join(__dirname,"material.js"),path.join(process.RESOURCES_PATH,"material.js"))