import { confirmConfig, confirmNative, changeDir} from "../../utils";

import {cordova} from "cordova-lib"
import { Chain, Loader } from "../../loader";
import yargs = require("yargs");

const tasks = new Chain<Loader>((prev,next)=>{
    if(prev){
        prev.succeed()
    }
    next.start()
},(last)=>{
    last.succeed()
},l=>l.map(e=>e.fail()))

tasks.list = [
    new Loader({
        text: "Running cordova prepare"
    })
]

export const command = "prepare [platforms..]"

export const desc = "Transforms config.xml metadata to platform-specific manifest files, copies icons & splashscreens, copies plugin files for specified platforms so that the project is ready to build with each native SDK."

export const builder = {
    browserify: {
        description: "Compile plugin JS at build time using browserify instead of runtime."
    }
}

export function handler(argv){
    try {
        confirmConfig();
        confirmNative();
        tasks.next()
        changeDir("native");
        cordova.prepare(argv)
        tasks.finish()
    } catch (error) {
        tasks.failed(error)
        process.exit()
    }
}