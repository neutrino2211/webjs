import yargs = require("yargs");
import { confirmConfig, confirmNative, changeDir } from "../../../utils";

import { cordova } from "cordova-lib";
import * as HooksRunner from "cordova-lib/src/hooks/HooksRunner.js"

export const command = "add <platform>"

export const desc = "Add taget platform to the project"

export const builder = {}

export function handler(argv){
    confirmConfig()
    confirmNative()
    changeDir("./native")
    add_platform(argv)
}

async function add_platform(args){
    try {
        const hr = new HooksRunner(process.cwd())
        cordova.on(args.verbose?"verbose":"log",(msg)=>{
            console.log(msg)
        })
        await cordova.platform.add(hr,process.cwd(),[args.platform],args)
    } catch (error) {
        console.log(error)
        process.exit()
    }
}