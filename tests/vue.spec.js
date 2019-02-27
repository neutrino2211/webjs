const fs = require("fs-extra");
const path = require("path");
const utils = require("../dist/utils");
const assert = require("assert");


describe("Vue app",function(){
    this.slow(9000)
    const vueTestDirectory = path.join(__dirname,"test-project-vue");
    process.chdir(vueTestDirectory)
    it("should have a dist folder",function(done){
        utils.compile(function(){
            var hasDistFolder = fs.existsSync(path.join(vueTestDirectory,"dist"));
            done()
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