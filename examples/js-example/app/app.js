//Declare imports here.
import * as wjs from "core"
import * as app from "wjs/app"
import { WJSModule } from "../webjs_modules/definitions";
import * as material from "../webjs_modules/material";
import Controller from "./pages/app.controller";
import { Reflex } from "./reflex.module";
import * as reflex from "./reflex.component";

class Application {
    constructor(){
        this.myCustomTag = new Reflex.Component(`
            <div class="blue card">
                <p>Hello</p>
            </div>
        `);
    }
    
    //Your apps entry point
    onViewLoad(){
        // document.body.style.backgroundColor = ""
        wjs.$("head").append("<link rel='stylesheet' href='pages/page.css'/>")
        function sms(number, message){
            if(typeof native !== "undefined"){
                native.sms(number,message);
            }else{
                console.error("Not deployed in android environment");
            }
        }
        // native.toast("Reflex")
        var HomePage = new Reflex.HTMLRenderer("./pages/app.reflex.html");
        
        HomePage.render(
            {
                component: reflex.Button3,
                tag: "app-button-3"
            },
            {
                component: reflex.Button2,
                tag: "app-button-2"
            },
            {
                component: reflex.Button1,
                tag: "app-button"
            },
            {
                component: reflex.FloatingActionButton,
                tag: "app-fab"
            },
            {
                component: reflex.Input,
                tag: "app-input"
            },
            {
                component: reflex.Nav,
                tag: "app-nav"
            },
            {
                component: reflex.Divider,
                tag: "app-divider"
            }
        );
    }
}

app.load(Application)
        