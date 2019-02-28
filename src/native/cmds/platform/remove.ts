import yargs = require("yargs");
import { confirmConfig, confirmNative, changeDir } from "../../../utils";

import { cordova } from "cordova-lib";
import * as HooksRunner from "cordova-lib/src/hooks/HooksRunner.js"

export const command = "remove [platforms..]"

export const desc = "Remove target platform to the project"

export function builder(){
    return yargs.option("nosave",{
        describe: "Do not delete specified platforms from config.xml & package.json after removing them",
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
        const hr = new HooksRunner(process.cwd())
        cordova.on(args.verbose?"verbose":"log",(msg)=>{
            console.log(msg)
        })
        await cordova.platform.remove(hr,process.cwd(),args.platforms,args)
    } catch (error) {
        console.log(error)
        process.exit()
    }
}