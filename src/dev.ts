import yargs = require("yargs");
import { getManifest, compile, confirmConfig } from "./utils";
import { Chain, Loader } from "./loader";
import definitions from "./proj-def";

import * as opn from 'opn';
import * as express from 'express';

var date = new Date()

const tasks = new Chain<Loader>((prev,loader)=>{
    date = new Date()
    if(prev){
        prev.succeed(`[${getTime()}] Built`)
    }
    loader.start()
},(last)=>{
    date = new Date()
    last.succeed(`[${getTime()}] Built`)
},list=>list.map(l=>l.fail()))

tasks.list = [
    new Loader({
        text: `[${getTime()}] Building wjs project`
    })
]

function getTime(){
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    return `${hours.toString().length == 1?'0'+hours:hours}:${minutes.toString().length == 1?'0'+minutes:minutes}:${seconds.toString().length == 1?'0'+seconds:seconds}`
}

export const description = "Builds and serves the app"

export const command = ["dev","d"]

export function builder (yargs: yargs.Argv){
    return yargs.options({
        verbose: {
            description: "Show output from parcel build"
        },
    
        logLevel: {
            description: "Log level for parcel build",
            type: "number"
        },

        port: {
            description: "Port to serve app",
            type: "number"
        }
    }).example("wjs dev","Serve the application and refresh on code change")
}

export async function handler(args: yargs.Arguments<{}>){
    if(args.verbose){
        args.logLevel = 3
    }
    try {
        confirmConfig()
        const manifest = getManifest()
        const serverRoot = definitions[manifest["project-type"]].serverRoot;
        const port = args.port||process.env.PORT||3100;
        const app = express()
        const logLevel = args.logLevel||0
        console.log("App is available on http://localhost:"+port)
        console.log("Watching "+manifest.entry)
        const bundler = await compile({
            target:"browser",
            publicUrl:"./",
            logLevel: logLevel
        })
        if(logLevel == 0){
            bundler.on("buildStart",()=>{
                tasks.restart()
                tasks.next()
            })
    
            bundler.on("buildEnd",()=>{
                tasks.finish()
            })
        }
        app.use(express.static(serverRoot))
        app.listen(port);
        if(args.open){
            opn('http://localhost:'+port)
        }
    } catch (error) {
        tasks.failed(error)
        process.exit()
    }
}