import { Loader, Chain } from "./loader";
import { confirmConfig } from "./utils";
import { emptyDirSync, existsSync } from "fs-extra";
import { handler as wjs_clean } from "./native/cmds/clean";

const tasks = new Chain<Loader>((_,next)=>{
    next.start();
},l=>{
    l.succeed();
},list=>list.map(l=>l.fail()));

tasks.list = [
    new Loader({
        text: "Clean pracel build artifacts"
    })
]

export const command = "clean"

export const description = "Cleans build artifacts left by parcel and cordova"

export const builder = {
    native: {
        description: "Clean cordova build artifacts"
    }
};

export async function handler(args){
    tasks.next()
    try {
        confirmConfig()

        if(existsSync(".cache")){
            emptyDirSync(".cache")
        }
        tasks.finish()

        if(args.native){
            await wjs_clean(args)
        }
    } catch (error) {
        tasks.failed(error)
        process.exit()
    }
}