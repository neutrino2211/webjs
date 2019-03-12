import { confirmConfig, confirmNative, changeDir, compile, makeCordovaEntry, cleanNative } from "../../utils";

import {cordova} from "cordova-lib"
import yargs = require("yargs");
import { Loader, Chain } from "../../loader";
import chalk from "chalk";

const tasks = new Chain<Loader>((prev,next)=>{
    if(prev){
        prev.succeed()
    }
    next.start()
}, (last)=>{
    last.succeed()
},list=>list.map(l=>l.fail()))

tasks.list = [
    new Loader({
        text: "Building wjs project"
    }),
    new Loader({
        text: "Patching into cordova"
    })
]

export const command = "run [platforms..]"

export const desc = "Run application"

export const builder = {
    browserify: {
        description: "Compile plugin JS at build time using browserify instead of runtime."
    },
    debug:{
        description: "Perform a debug build"
    },
    release: {
        description: "Perform a release build."
    },
    device: {
        description: "Build it for a device."
    },
    emulator: {
        description: "Build it for an emulator."
    },
    buildConfig: {
        description: "Default: build.json in cordova root directory. ",
        type: "string"
    },
    noprepare: {
        description: "Skip preparing."
    },
    nobuild: {
        description: "Skip building"
    },
    target: {
        description: "Deploy to a specific target emulator/device"
    }
}

export async function handler(argv){
    try {    
        confirmConfig();
        confirmNative();
        cleanNative();
        tasks.next()
        if(!argv.nobuild){
            await compile({
                minify: false,
                target: "browser",
                publicUrl: "./",
                outDir: "native/www",
                logLevel:1,
                watch: true
            })
            tasks.next()
            makeCordovaEntry();
            changeDir("./native")
            run(argv)
        } else {
            tasks.next()
            makeCordovaEntry()
            changeDir("./native")
            run(argv)
        }
    } catch(error){
        tasks.failed(error)
    }
}

async function run(argv){
    try {
        tasks.finish()
        const br = process.argv.indexOf("--");
        argv.options = {}
        argv.options.argv = []
        if(br != -1){
            argv.options.argv.concat(process.argv.slice(br))
        }
        argv.options.argv.push('--gradleArg=-q')
        console.log(chalk.green(chalk.dim('Running app...')))
        await cordova.run(argv)
    } catch (error) {
        console.error(error)
        process.exit()
    }
}