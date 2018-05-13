const fs = require("fs-extra");
const path = require("path");
const utils = require("../bin/utils");
const assert = require("assert");

describe("Javascript app",function(){
    const jsTestDirectory = path.join(__dirname,"test-project-js");
    process.chdir(jsTestDirectory)
    it("should have a dist folder",function(done){
        utils.compile(function(){
            var hasDistFolder = fs.existsSync(path.join(jsTestDirectory,"dist"));
            done(!hasDistFolder)
        })
    }).timeout(30000)

    it("should not have a compile command entry in the manifest",function(){
        assert(utils.getManifest().compileCommand === undefined,false)
    })

    it("should have enrty point as src/index.html",function(){
        assert(utils.getManifest().entry,"src/index.html")
    })

    it("should have the dist folder as compiled directory",function(){
        assert(utils.getManifest().root,"dist")
    })
})