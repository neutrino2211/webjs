#!/usr/bin/env node
import * as yargs from "yargs";

import * as createCommand from "./create"
import * as buildCommand from "./build"
import * as cleanCommand from "./clean"
import * as devCommand from './dev'
import chalk from "chalk";


yargs.usage("Usage: wjs <command> [..options]")
.command(<any>devCommand)
.command(<any>buildCommand)
.command(<any>createCommand)
.command(<any>cleanCommand)
.commandDir("./native")
.option("version",{
    alias: "v",
    describe: "Show version number"
})
.help("help")
.alias("h","help").argv;