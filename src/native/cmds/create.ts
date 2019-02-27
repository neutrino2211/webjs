import { confirmConfig } from "../../utils";

import {cordova} from "cordova-lib"
import { sep } from "path";

export const command = "create <id> [name]"

export const desc = "Create cordova project"

export const builder = {}

export function handler(argv){
    confirmConfig();
    create(argv)
}

async function create(args){
    try {
        cordova.on(args.verbose?"verbose":"log",console.log);
        await cordova.create("native",args.id,args.name||process.cwd().split(sep).reverse()[0],"{}"); 
    } catch (error) {
        console.log(error)
        process.exit()
    }
}