import * as fs from "fs-extra"
import * as path from "path"
import * as assert from "assert";
import * as utils from "../src/utils"
import { Builder, By } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome"
import { before } from "mocha";



describe("Project utils",()=>{
    describe("#manifest",()=>{
        it("should return undefined when package.json does not exist",()=>{
            assert.strictEqual(utils.getManifest(),undefined)
        })

        it("should fail to make manifest when package.json does not exist",()=>{
            try {
                utils.makeManifest({})
                return false
            } catch (error) {
                return true
            }
        })
    })

    describe("#compiler",()=>{
        before(async ()=>{
            await utils.compile({
                inputFile: "./assets/compile/index.html",
                watch: false,
                outDir: "./assets/compile/dist",
                logLevel: 0,
                target: "browser",
                publicUrl: "./"
            })
        })
        it("should have compiled successfully",()=>{
            return fs.existsSync("./assets/compile/dist") && fs.readdirSync("./assets/compile/dist").length > 0
        })

        it("should have transformed index.js",()=>{
            const jsFiles = fs.readdirSync("./assets/compile/dist").filter(file=>{
                return file.endsWith(".js")
            })
            const filename = jsFiles.find(v=>{
                return v.startsWith("compile")
            })

            assert(!fs.readFileSync(path.join("assets/compile/dist",filename)).toString('utf-8').startsWith("import"))
        })

        it("should execute succesfully",async ()=>{
            const builder = await new Builder().forBrowser('chrome')
            builder.setChromeOptions(new chrome.Options().headless())
            const driver = await builder.build()
            await driver.get("file:///"+path.join(process.cwd(),"assets/compile/dist/index.html"))
            const h1 = await driver.findElement(By.id("text"))
            const text = await h1.getText()
            await driver.quit()
            assert.equal(text,"Hello World");
        })

        after(function(){
            fs.emptyDirSync("./.cache")
            fs.rmdirSync("./.cache")
        })
    })

    describe("#native",()=>{
        before(function(){
            fs.mkdirpSync("./native/www")
            fs.copySync("./assets/compile/dist","./native/www")
        })

        it("should be able to add licences, meta and cordova.js to the old entry",()=>{
            utils.makeCordovaEntry()
            assert(fs.readFileSync("./native/www/index.html").toString('utf-8').includes(utils.apacheLicense))
        })

        it("should be able to remove native/www",()=>{
            utils.cleanNative()
            assert.strictEqual(fs.readdirSync("./native/www").length,0)
        })

        after(function(){
            fs.emptyDirSync("./native")
            fs.rmdirSync("./native");

            fs.emptyDirSync("./assets/compile/dist")
            fs.rmdirSync("./assets/compile/dist")
        })
    })
})