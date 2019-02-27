import { confirmConfig, confirmNative, changeDir } from "../../utils";

import {cordova} from "cordova-lib"

export const command = "run <platform> [options]"

export const desc = "Run application"

export const builder = {}

export function handler(argv){
    confirmConfig();
    confirmNative()
    changeDir("./native")
    run(argv)
}

async function run(args){
    try {
        await cordova.run(args)   
    } catch (error) {
        console.log(error)
        process.exit()
    }
}