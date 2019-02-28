import { confirmConfig, confirmNative, changeDir } from "../../../utils";

import { cordova } from "cordova-lib";

export const command = "save"

export const desc = "Save <plugin-spec> of all plugins currently added to the project";

export const builder = {}

export function handler(argv){
    confirmConfig()
    confirmNative()
    changeDir("./native")
    save_plugin(argv)
}

async function save_plugin(args){
    try {
        cordova.on(args.verbose?"verbose":"log",(msg)=>{
            console.log(msg)
        })
        await cordova.plugin.save(process.cwd())
    } catch (error) {
        console.log(error)
        process.exit()
    }
}