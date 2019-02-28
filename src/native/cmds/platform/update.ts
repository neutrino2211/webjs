import yargs = require("yargs");
import { confirmConfig, confirmNative, changeDir } from "../../../utils";

import { cordova } from "cordova-lib";
import * as HooksRunner from "cordova-lib/src/hooks/HooksRunner.js"

export const command = "update <platform>"

export const desc = "Update specified platforms"

export function builder(){
    return yargs.option("save",{
        describe: "Updates the version specified in config.xml",
    });
}

export function handler(argv){
    confirmConfig()
    confirmNative()
    changeDir("./native")
    update_platform(argv)
}

async function update_platform(args){
    try {
        const hr = new HooksRunner(process.cwd())
        cordova.on(args.verbose?"verbose":"log",(msg)=>{
            console.log(msg)
        })
        await cordova.platform.update(hr,process.cwd(),[args.platform],args)
    } catch (error) {
        console.log(error)
        process.exit()
    }
}