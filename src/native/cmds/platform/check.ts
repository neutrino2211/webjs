import yargs = require("yargs");
import { confirmConfig, confirmNative, changeDir } from "../../../utils";

import { cordova } from "cordova-lib";
import * as HooksRunner from "cordova-lib/src/hooks/HooksRunner.js"

export const command = "check"

export const desc = "List platforms which can be updated via cordova-cli with the command platform update"

export const builder = {};

export function handler(argv){
    confirmConfig()
    confirmNative()
    changeDir("./native")
    check_platform(argv)
}

async function check_platform(args){
    try {
        const hr = new HooksRunner(process.cwd())
        cordova.on("results",(msg)=>{
            console.log(msg)
        })
        await cordova.platform.check(hr,process.cwd())
    } catch (error) {
        console.log(error)
        process.exit()
    }
}