import { confirmConfig, confirmNative, changeDir, compile, makeCordovaEntry, cleanNative } from "../../utils";

import {cordova} from "cordova-lib"

export const command = "run <platform>"

export const desc = "Run application"

export const builder = {}

export function handler(argv){
    confirmConfig();
    confirmNative();
    cleanNative();
    process.env.NODE_ENV = "production"
    compile(()=>{
        makeCordovaEntry();
        changeDir("./native")
        run(argv)
    },{
        minify: true,
        target: "browser",
        publicUrl: "./",
        outDir: "native/www"
    })
}

async function run(args){
    try {
        args.platforms = [args.platform]
        await cordova.run(args)
    } catch (error) {
        console.log(error)
        process.exit()
    }
}