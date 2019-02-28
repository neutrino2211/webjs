import yargs = require("yargs");
import { confirmConfig, confirmNative, changeDir } from "../../../utils";

import { cordova } from "cordova-lib";
import * as HooksRunner from "cordova-lib/src/hooks/HooksRunner.js"

export const command = "remove ...plugins"

export const desc = "Remove plugin from project"

export function builder(){
    return yargs.option("nosave",{
        describe: "Do NOT remove the specified plugin from config.xml or package.json",
    })
}

export function handler(argv){
    confirmConfig()
    confirmNative()
    changeDir("./native")
    remove_platform(argv)
}

async function remove_platform(args){
    try {
        args.plugins = process.argv.slice(5)
        const hr = new HooksRunner(process.cwd())
        cordova.on(args.verbose?"verbose":"log",(msg)=>{
            console.log(msg)
        })
        await cordova.plugin.remove(process.cwd(),args.plugins,hr,args)
    } catch (error) {
        console.log(error)
        process.exit()
    }
}