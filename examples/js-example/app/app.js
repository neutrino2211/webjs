//Declare imports here.
import * as wjs from "core"
import * as app from "wjs/app"
import { TemplateApplication } from "../webjs_modules/definitions";
import * as material from "../webjs_modules/material";
import { Reflex } from "./reflex.module";
import * as reflex from "./reflex.component";

class Application extends TemplateApplication{
    constructor(){
        super();
        this.myCustomTag = new Reflex(`
            <div class="blue card">
                <p>Hello</p>
            </div>
        `);

        this.template = `
            <Nav reflex-title="SMS Page"/>
            <!--<h1>Hello</h1>
            <Reflex style="color:red;"/>-->
            <input placeholder="Number" type="text" id="number-input" style="padding-top:30%;"/>
            <input id="message-body" placeholder="Message"/>
            <app-button id="callBtn"reflex-text="Send"/>
        `;
    }
    
    //Your apps entry point
    onTemplateLoad(){
        // console.log(material.colors.blue)
        function call(number){
            if(typeof native !== "undefined"){
                native.call(number);
            }else{
                console.error("Not deployed in android environment");
            }
        }

        function sms(number, message){
            if(typeof native !== "undefined"){
                native.sms(number,message);
            }else{
                console.error("Not deployed in android environment");
            }
        }

        function toast(message){
            if(typeof native !== "undefined"){
                native.toast(message);
            }else{
                console.error("Not deployed in android environment");
            }
        }
        var callBtn = document.getElementById("callBtn");
        callBtn.onclick = function(){
            var err = false;
            var num = wjs.$("#number-input").val();
            var bod = wjs.$("#message-body").val();

            if(num.trim() == ""){
                wjs.$("#number-input").css("border-color","red");
                err = true;
            }else{
                wjs.$("#number-input").css("border-color","green");
            }

            if(bod.trim() == ""){
                wjs.$("#message-body").css("border-color","red");
                err = true;
            }else{
                wjs.$("#message-body").css("border-color","green");
            }

            if(err){
                return;
            }

            sms(num,bod);
            toast("Sending message");
        }
        this.myCustomTag.render("Reflex");
        reflex.Button.render("app-button");
        reflex.Nav.render("Nav");
    }
}

app.load(Application)
        