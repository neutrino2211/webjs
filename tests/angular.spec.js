const fs = require("fs-extra");
const path = require("path");
const utils = require("../dist/utils");
const assert = require("assert");

describe("Angular app",function(){
    this.slow(60000)
    const ngTestDirectory = path.join(__dirname,"test-project-ng");
    process.chdir(ngTestDirectory)
    it("should have a dist folder",function(done){
        utils.compile(function(){
            var hasDistFolder = fs.existsSync(path.join(ngTestDirectory,"dist"));
            done(hasDistFolder)
        },{watch: false})
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

    it("should have a package.json",function(){
        assert(fs.existsSync(process.cwd(),"package.json"),true)
    })
})