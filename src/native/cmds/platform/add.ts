import yargs = require("yargs");
import { confirmConfig, confirmNative, changeDir } from "../../../utils";

import { cordova } from "cordova-lib";
import * as HooksRunner from "cordova-lib/src/hooks/HooksRunner.js"

export const command = "add [platforms..]"

export const desc = "Add taget platform to the project"

export function builder(){
    return yargs.option("nosave",{
        describe: "Do not save <platform-spec> into config.xml & package.json after installing them using <engine> tag",
    }).option("link",{
        describe: "When <platform-spec> is a local path, links the platform library directly instead of making a copy of it",
        type: "string"
    })
}

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
        await cordova.platform.add(hr,process.cwd(),args.platforms,args)
    } catch (error) {
        console.log(error)
        process.exit()
    }
}