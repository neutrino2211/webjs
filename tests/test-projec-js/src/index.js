import * as app from "../webjs_modules/app";

class App {
    constructor (root){
        root.innerHTML = "<h1>Hello World</h1>";
    }

    onViewLoad(){
        console.log("Done")
    }
}

app.load(document.getElementById("js-main"),App);