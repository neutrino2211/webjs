import yargs = require("yargs");
import { confirmConfig, confirmNative, changeDir } from "../../../utils";

import { cordova } from "cordova-lib";
import * as HooksRunner from "cordova-lib/src/hooks/HooksRunner.js"

export const command = "add ...plugins"

export const desc = "Add specified plugins"

export function builder(){
    return yargs.option("nosave",{
        describe: "Do NOT save the <plugin-spec> as part of the plugin element into config.xml or package.json.",
    }).option("link",{
        describe: "	When installing from a local path, creates a symbolic link instead of copying files. The extent to which files are linked varies by platform. Useful for plugin development.",
    }).option("searchpath",{
        describe: "When looking up plugins by ID, look in this directory and each of its subdirectories before hitting the registry. Multiple search paths can be specified. Use ':' as a separator in *nix based systems and ';' for Windows.",
        type: "string"
    }).option("noregistry",{
        describe: "Don't search the registry for plugins."
    }).option("browserify",{
        describe: "Compile plugin JS at build time using browserify instead of runtime."
    }).option("force",{
        describe: "Introduced in version 6.1. Forces copying source files from the plugin even if the same file already exists in the target directory."
    })
}

export function handler(argv){
    confirmConfig()
    confirmNative()
    changeDir("./native")
    add_plugin(argv)
}

async function add_plugin(args){
    try {
        args.plugins = process.argv.slice(5)
        const hr = new HooksRunner(process.cwd())
        cordova.on(args.verbose?"verbose":"log",(msg)=>{
            console.log(msg)
        })
        await cordova.plugins.add(process.cwd(),hr,args)
    } catch (error) {
        console.log(error)
        process.exit()
    }
}