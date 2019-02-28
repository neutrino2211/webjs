import yargs = require("yargs");
import { confirmConfig, confirmNative, changeDir } from "../../../utils";

import { cordova } from "cordova-lib";
import * as HooksRunner from "cordova-lib/src/hooks/HooksRunner.js"

export const command = "search [plugins..]"

export const desc = "Search http://plugins.cordova.io for plugins matching the keywords"

export const builder = {}

export function handler(argv){
    confirmConfig()
    confirmNative()
    changeDir("./native")
    search_plugin(argv)
}

async function search_plugin(args){
    try {
        const hr = new HooksRunner(process.cwd())
        cordova.on(args.verbose?"verbose":"log",(msg)=>{
            console.log(msg)
        })
        await cordova.plugin.search(hr,args)
    } catch (error) {
        console.log(error)
        process.exit()
    }
}