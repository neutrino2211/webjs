#!/usr/bin/env node
import * as yargs from "yargs";

import * as createCommand from "./create"
import * as buildCommand from "./build"
import * as devCommand from './dev'


yargs.usage("Usage: wjs <command> [..options]")
.command(<any>devCommand)
.command(<any>buildCommand)
.command(<any>createCommand)
.commandDir("./native")
.command("$0",devCommand.description,devCommand.builder,devCommand.handler)
.option("version",{
    alias: "v",
    describe: "Show version number"
})
.help("help")
.alias("h","help")
.demandCommand().argv;