import { cordova } from "cordova-lib";
import { changeDir } from "../../utils";
import { emojify } from "node-emoji";
import chalk from "chalk";

export const command = "requirements [platforms..]"

export const description = "List requirements for a platform"

export const builder = {}

export function handler(args){
    changeDir("native")
    requirements(args.platforms)
}

async function requirements(platforms){
    try {
        const res = await cordova.requirements(platforms)
        Object.getOwnPropertyNames(res).forEach(p=>{
            console.log(chalk.green(p))
            res[p].forEach(r=>{
                console.log(emojify(`\t${r.name} ${r.installed?":white_check_mark:":"x"}`))
            })
        })
    } catch (error) {
        console.log(error)
        process.exit()
    }
}