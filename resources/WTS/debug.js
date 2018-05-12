export class Debugger {
    constructor(){
        this.native = window.native?true:false;
    }

    log({all: allErrors,errorType: et}){
        if(allErrors){
            if(this.native){
                window.onerror = function(e,f,l){
                    native.toast(`${e}\nat\t${f} on line ${l}`);
                }
            }else{
                window.onerror = function(e,f,l){
                    console.error(`${e}\nat\t${f} on line ${l}`);
                }
            }
        }else{
            if(this.native){
                window.onerror = function(e,f,l){
                    if(e.split("Uncaught ")[1].split(":")[0].trim() == et)
                        native.toast(`${e}\nat\t${f} on line ${l}`);
                }
            }else{
                window.onerror = function(e,f,l){
                    if(e.split("Uncaught ")[1].split(":")[0].trim() == et)
                        console.error(`${e}\nat\t${f} on line ${l}`);
                }
            }
        }
    }
}