import { $ } from "core";

export function WJSModule(options){
    $(document.body).load(options.template.startsWith("/") ? options.template : "/"+options.template);
    var p = new options.controller(document);
    (options.styleSheets ? options.styleSheets : []).forEach(function(element) {
        var css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = element;
        document.head.appendChild(css);
    }, this);
    document.body.onload = ()=>{
        p.onViewLoad();
    }
}

export class HTMLModule{
    constructor(document){
        /*Do stuff*/
    }
}

export class TemplateApplication{
    constructor(){
        console.log("Ready")
        document.addEventListener("__INIT__",()=>{
            this.onViewLoad();
        },this);
    }

    main(){
        $("body").append(this.template)
        document.dispatchEvent(new Event("__INIT__"))
        // window.WJS_PAGE_STATE = 1;
    }
}

export class TemplateApplicationPage{
    /**
     * 
     * @param {HTMLElement} element 
     */
    constructor(element){
        this.element = element;
        if(window.openPage){
            window.openPage.close()
        }
        window.openPage = this;
        console.log("page created")
    }
    close(){
        this.isClosed = true;
        this.element.innerHTML = ""
    }
}