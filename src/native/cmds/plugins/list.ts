import yargs = require("yargs");
import { confirmConfig, confirmNative, changeDir } from "../../../utils";

import { cordova } from "cordova-lib";
import * as HooksRunner from "cordova-lib/src/hooks/HooksRunner.js"

export const command = "list"

export const desc = "List currently installed plugins"

export const builder = {};

export function handler(argv){
    confirmConfig()
    confirmNative()
    changeDir("./native")
    list_plugin(argv)
}

function list_plugin(args){
    try {
        const hr = new HooksRunner(process.cwd())
        cordova.on("results",(msg)=>{
            console.log(msg)
        })
        cordova.plugin.list(process.cwd(),hr,args)
    } catch (error) {
        console.log(error)
        process.exit()
    }
}