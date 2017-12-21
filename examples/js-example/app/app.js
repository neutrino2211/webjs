//Declare imports here.
import * as wjs from "core"
import * as app from "wjs/app"
import { TemplateApplication } from "../webjs_modules/definitions";
import { parseHTML } from "wjs/app";

class Reflex{
    constructor(html){
        this.__html = html;
    }

    render(tag){
        var b = parseHTML(this.__html).body.children;
        var tags = document.getElementsByTagName(tag);

        for(var i=0;i<tags.length;i++){

            for(var j=0;j<b.length;j++){
                tags[i].appendChild(b[j]);
            }
        }
    }
}

class Application extends TemplateApplication{
    constructor(){
        super()

        this.myCustomTag = new Reflex(`
            <div class="blue card" style="width:50%;height:50%;margin:25%;">
                <p>Hello</p>
            </div>
        `);

        this.template = `
            <h1>Hello</h1>
            <Reflex/>
        `;
    }
    
    //Your apps entry point
    onTemplateLoad(){
        this.myCustomTag.render("Reflex");
    }
}

app.load(Application)
        