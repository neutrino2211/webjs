import yargs = require("yargs");
import { getManifest, compile, confirmConfig } from "./utils";
import { Chain, Loader } from "./loader";

const tasks = new Chain<Loader>((prev,loader)=>{
    if(prev){
        prev.succeed()
    }
    loader.start()
},(last)=>{
    last.succeed()
},list=>list.map(l=>l.fail()))

tasks.list = [
    new Loader({
        text: "Building wjs project"
    })
]

export const description = "Build wjs project"

export const command = ["build","b"]

export function builder (yargs: yargs.Argv){
    return yargs.options({
        verbose: {
            description: "Show output from parcel build"
        },
    
        logLevel: {
            description: "Log level for parcel build"
        }
    }).example("wjs build","Build project for production")
}

export async function handler(args: yargs.Arguments<{}>){
    if(args.verbose){
        args.logLevel = 3
    }
    try {
        confirmConfig()
        const manifest = getManifest()
        tasks.next()
        await compile({
            minify:true,
            target:"browser",
            publicUrl:"./",
            logLevel: args.logLevel||0,
            outDir: args.o||args.outDir||manifest.root,
            watch: false
        })
        tasks.finish()
    } catch (error) {
        tasks.failed(error)
        process.exit()
    }
}