import yargs = require("yargs");
import { confirmConfig, confirmNative, changeDir } from "../../../utils";

import { cordova } from "cordova-lib";
import * as HooksRunner from "cordova-lib/src/hooks/HooksRunner.js"

export const command = "list"

export const desc = "List all installed and available platforms"

export const builder = {};

export function handler(argv){
    confirmConfig()
    confirmNative()
    changeDir("./native")
    list_platform(argv)
}

function list_platform(args){
    try {
        const hr = new HooksRunner(process.cwd())
        cordova.on("results",(msg)=>{
            console.log(msg)
        })
        cordova.platform.list(hr,process.cwd(),args)
    } catch (error) {
        console.log(error)
        process.exit()
    }
}