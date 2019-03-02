import { cordova_platforms } from "cordova-lib"
import * as HooksRunner from "cordova-lib/src/hooks/HooksRunner"
import * as cordova_util from "cordova-lib/src/cordova/util"

import { Loader, Chain } from "../../loader";
import { confirmConfig, confirmNative, changeDir } from "../../utils";

const tasks = new Chain<Loader>((_,next)=>{
    next.start();
},l=>{
    l.succeed();
},list=>list.map(l=>l.fail()));

tasks.list = [
    new Loader({
        text: "Clean cordova build artifacts"
    })
]

export const command = "clean [platform..]"

export const description = "Cleans build artifacts from all/specified platforms"

export const builder = {};

export async function handler(args){
    tasks.next()
    try {
        confirmConfig()
        confirmNative()
        changeDir("native");
        // args.options = {}
        args.argv = []
        args.argv.push('--gradleArg=-q')
        const oldLog = console.log;
        console.log = function(){}
        await clean(args)
        console.log = oldLog;
        tasks.finish()
    } catch (error) {
        tasks.failed(error)
        process.exit()
    }
}

export async function clean(args){
    const projectRoot = cordova_util.cdProjectRoot()
    args = cordova_util.preProcessOptions(args)
    const hooksRunner = new HooksRunner(projectRoot)
    await hooksRunner.fire("before_clean",args)
    for(let i=0; i< args.platforms.length;i++){
        const p = args.platforms[i];
        await cordova_platforms.getPlatformApi(p).clean(args)
    }
    await hooksRunner.fire("after_clean",args)
}