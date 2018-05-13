import * as app from "../webjs_modules/app";

class App {
    constructor (root : HTMLElement){
        root.innerHTML = "<h1>Hello World</h1>";
    }

    onTemplateLoad(){
        console.log("Done")
    }
}

app.load(document.getElementById("ts-main"),App);