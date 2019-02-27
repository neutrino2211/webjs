import yargs = require("yargs");

export const command = "platform <command>"

export const desc = "Manage target platforms"

export function builder(yargs: yargs.Argv){
    yargs.commandDir("./platform")
}

export function handler(argv){
    console.log(argv)
}