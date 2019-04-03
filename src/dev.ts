import yargs = require("yargs");
import { getManifest, confirmConfig, asyncCompile } from "./utils";
import { Chain, Loader } from "./loader";
import definitions from "./proj-def";

import * as opn from 'opn';
import * as express from 'express';
import chalk from "chalk";

var date = new Date()
let projectType: string;
let projectColor: number[];

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

function getTime(){
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    return `${hours.toString().length == 1?'0'+hours:hours}:${minutes.toString().length == 1?'0'+minutes:minutes}:${seconds.toString().length == 1?'0'+seconds:seconds}`
}

export const description = "Builds and serves the app"

export const command = ["dev","d","$0"]

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
    
    if(args._[0] != "dev" && args._[0] != "d" && args._[0]){
        yargs.showHelp()
        process.exit(1)
    }
    try {
        confirmConfig()
        const manifest = getManifest()
        projectType = manifest["project-type"]
        projectColor = definitions[projectType].color;
        tasks.list = [
            new Loader({
                text: `[${getTime()}] Building ${chalk.rgb.call(chalk,...projectColor)(projectType)} project`
            })
        ]
        const serverRoot = definitions[manifest["project-type"]].serverRoot;
        const port = args.port||process.env.PORT||3100;
        const app = express()
        const logLevel = args.logLevel||0
        console.log("App is available on http://localhost:"+port)
        console.log("Watching "+manifest.entry)
        const bundler = await asyncCompile({
            target:"browser",
            publicUrl:"./",
            logLevel: logLevel,
            watch: true
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