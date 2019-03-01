import * as yargs from "yargs"
import { confirmConfig, confirmNative, changeDir, compile, makeCordovaEntry} from "../../utils";

import {cordova} from "cordova-lib"
import { Loader, Chain } from "../../loader";
import chalk from "chalk";

const tasks = new Chain<Loader>((previous, next)=>{
    if(previous){
        previous.succeed()
    }
    next.start()
},(last)=>{
    last.succeed()
})

tasks.list = [
    new Loader({
        text: "Building wjs project"
    }),
    new Loader({
        text: "Patching into cordova"
    }),
    new Loader({
        text: "Building cordova project"
    })
]

export const command = "build [platforms..]"

export const desc = "Build platform"
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
    log: {
        description: "Show output from cordova"
    },
    nonative: {
        description: "Build wjs project only"
    }
}

export function handler(argv){
    confirmConfig(false);
    confirmNative();
    tasks.next()
    process.env.NODE_ENV = "production"
    compile(()=>{
        tasks.next()
        makeCordovaEntry();
        if(!argv.nonative){
            changeDir("./native")
            build(argv)
        } else {
            tasks.finish()
        }
    },{
        minify: true,
        target: "browser",
        publicUrl: "./",
        outDir: "native/www",
        logLevel:1
    })
}

async function build(argv){
    try {
        const br = process.argv.indexOf("--");
        argv.options = {}
        argv.options.argv = []
        if(br != -1){
            argv.options.argv.concat(process.argv.slice(br))
        }
        if(!argv.log){
            argv.options.argv.push('--gradleArg=-q')
            tasks.next()
        } else {
            tasks.finish()
            console.log(chalk.green(chalk.dim('Building cordova project...')))
        }
        const old_log = console.log
        console.log = function(){}
        await cordova.build(argv)
        console.log = old_log;
        if(!argv.log){
            tasks.finish()
        }
    } catch (e) {
        tasks.failed(e)
        process.exit()
    }
}