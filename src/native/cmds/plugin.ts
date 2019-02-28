import yargs = require("yargs");

export const command = "plugin <command>"

export const desc = "Manage project plugins"

export function builder(yargs: yargs.Argv){
    yargs.commandDir("./plugins")
}

export function handler(){
    yargs.showHelp()
}