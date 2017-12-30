import { Reflex } from "./reflex.module";
import { colors } from "../webjs_modules/material";

export var Divider = new Reflex.Component(`
<div class="divider"></div>
`);

export var Button3 = new Reflex.Component(`
<button class="btn {{color}} {{class}}" style="color:white;margin-top:10px;margin-left:8%;width:22%;display:inline-block;">{{name}}</button>
`);

export var Button2 = new Reflex.Component(`
<button class="btn {{color}} {{class}}" style="color:white;margin-top:10px;margin-left:9.5%;width:35%;display:inline-block;">{{name}}</button>
`);

export var Button1 = new Reflex.Component(`
<button class="btn {{color}} {{class}}" style="color:white;margin-top:10px;margin-left:20%;width:60%;display:inline-block;">{{name}}</button>
`);

export var Nav = new Reflex.Component(`
    <nav class="{{color}}"style="text-align:center;"><p class"text center {{text-color}}" style="font-family:monospace;font-size:27px;">{{title}}</p></nav>
`);

export var Input = new Reflex.Component(`
    <input placeholder="{{placeholder}}" type="{{type}}" id="{{id}}" style="{{style}};width:90%;margin-left:5%;"></input>
`)

export var FloatingActionButton = new Reflex.Component(`
    <div class="fixed-action-btn {{position}} {{type}}"><a class="btn-floating btn-{{size}} {{color}}"><i class="material-icons">{{icon}}</i></a></div>
`)