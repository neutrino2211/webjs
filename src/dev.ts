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
        prev.succeed(`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] Built`)
    }
    loader.start()
},(last)=>{
    date = new Date()
    last.succeed(`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] Built`)
},list=>list.map(l=>l.fail()))

tasks.list = [
    new Loader({
        text: `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] Building wjs project`
    })
]

export const description = "Serve the application and refresh on code change"

export const command = ["dev","d"]

export function builder (yargs: yargs.Argv){
    return yargs.options({
        verbose: {
            description: "Show output from parcel build"
        },
    
        logLevel: {
            description: "Log level for parcel build"
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
        const bundler = await compile({
            target:"browser",
            publicUrl:"./",
            logLevel: args.logLevel||0
        })
        bundler.on("buildStart",()=>{
            tasks.restart()
            tasks.next()
        })

        bundler.on("buildEnd",()=>{
            tasks.finish()
        })
        app.use(express.static(serverRoot))
        app.listen(port);
        console.log("App is available on http://localhost:"+port)
        console.log("Watching "+manifest.entry)
        if(args.open){
            opn('http://localhost:'+port)
        }
    } catch (error) {
        tasks.failed(error)
        process.exit()
    }
}