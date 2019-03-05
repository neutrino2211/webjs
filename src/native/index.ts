import yargs = require("yargs");

export const command = "native <command>"

export const desc = "Run cordova commands"

export function builder(yargs: yargs.Argv){
    return yargs.commandDir("./cmds")
    .option("verbose",{
        description: "Log more information.",
        alias: "vv",
        type: "boolean"
    })
}

export function handler(){
    yargs.showHelp()
}