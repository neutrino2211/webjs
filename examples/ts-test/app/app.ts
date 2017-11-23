//Declare imports here.
import * as wjs from "core"
import * as app from "wjs/app"


class Application{
    constructor(){
        wjs.print("ready")
    }
    
    //Your apps entry point
    onViewLoad(){
        wjs.print("main")
    }
}

app.load(Application)