import { Reflex } from "./reflex.module";
import { colors } from "../webjs_modules/material";

export var Button = new Reflex(`
    <button class="btn blue" style="color:white;margin-left:20%;width:60%;">{{text}}</button>
`);

export var Nav = new Reflex(`
    <nav style="text-align:center;background-color:${colors.blue}"><p class"text center" style="font-family:monospace;">{{title}}</p></nav>
`);