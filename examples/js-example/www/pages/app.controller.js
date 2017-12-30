import * as reflex from "../reflex.component";
import { WJSModule } from "wjs/definitions";
import * as wjs from "core";

export default class Controller{
    /**
     * 
     * @param {HTMLDocument} doc 
     */
    constructor(doc){
        console.log("Ready");
        this.doc = doc;
    }

    onViewLoad(){
        alert("Loaded");
        reflex.FloatingActionButton.render("app-fab",this.doc);
        reflex.Button3.render("app-button-3",this.doc);
        reflex.Input.render("app-input",this.doc);
        reflex.Nav.render("app-nav",this.doc);
    }
}