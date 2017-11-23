import * as wjs from "core"
import * as app from "wjs/app"
import {TemplateApplication,WJSModule} from "wjs/definitions"
import {LoginPage} from "pages/login"
import { TestPage } from "./pages/test/testpage";

//Declare imports here.

class Application extends TemplateApplication{
    constructor(){
        super()
        // document.body.className = "lighten-3"
        this.template = `
        <html>
        <body>
            <nav class="blue" id="nav" style="position: fixed;margin-top=-5px; z-index:999;"><p style="font-family:monospace;font-size:20px;" class="text center" id="Title">Chat</p></nav>
            <!--<div style="width:50%;height:50%;background-color:red;" class="card" id="slideout"></div>-->
            <div id="root" style="padding:1em;"></div>
        </body>
        </html>
        `
    }

    onViewLoad(){
        var root = document.getElementById("root");
        new LoginPage(root);
        // WJSModule({
        //     controller: TestPage,
        //     template: "/pages/test/testpage.html",
        //     styleSheets: ["/pages/test/testpage.css"]
        // });
    }
}

app.load(Application);