import yargs = require("yargs");

export const command = "native <command>"

export const desc = "Run cordova commands"

export function builder(yargs: yargs.Argv){
    yargs.commandDir("./cmds")
}

export function handler(){
    yargs.showHelp()
}