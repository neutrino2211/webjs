//Declare imports here.
import { $ } from "core";
import * as app from "wjs/app";
import { TickTockHome } from "./views/tick_tock";
import { TemplateApplication } from "wjs/definitions";

window.SPLASH = true;

class Application extends TemplateApplication {
    constructor(){
        super();
        this.template = `
            <html>
            <head>
                <style type="text/css">
                    .splash {
                        height: 100vh;
                        width: 100%;
                    }
            
                    .logo {
                        font-size: 3em;
                    }
            
                    .logo i {
                        margin-top: 60%;
                        border: 2px solid white;
                        border-radius: 100%;
                        padding: 1em;
                    }
                </style>
            </head>
            <body>
            
            
                <div class="splash deep-orange">
                    
                    <div class="logo center">
                    
                        <i class="material-icons" id="logo" style="color:#eeeeee;">timer</i>
            
                    </div>
                </div>
            
            </body>
            </html>
        `;

    }
    
    //Your apps entry point
    onTemplateLoad(){
        if(window.SPLASH){
            var logo = document.getElementById("logo");
            console.log(logo)
            var si = setInterval(function(){
                if(window.SPLASH){
                    $(logo).animate({
                        borderColor : "#ff5722"
                    },1000,function(){
                        $(logo).animate({
                            borderColor : "white"
                        },1000)
                    })
                }
            },2000)
    
            var st = setTimeout(function(){
                if(window.SPLASH){
                    document.body.innerHTML = "";
                    clearTimeout(st);
                    clearInterval(si)
                    window.SPLASH = false;
                    app.load(TickTockHome);
                }
            },6000)
        }
    }
}

app.load(Application)
        