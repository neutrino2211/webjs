export class Debugger {
    private native : any
    constructor(){
        this.native = window.native?true:false;
    }

    log(allErrors : boolean, et? : string){
        if(allErrors){
            if(this.native){
                window.onerror = function(e,f,l){
                    this.native.toast(`${e}\nat\t${f} on line ${l}`);
                }
            }else{
                window.onerror = function(e,f,l){
                    console.error(`${e}\nat\t${f} on line ${l}`);
                }
            }
        }else{
            if(this.native){
                window.onerror = function(e,f,l){
                    var E = e.toString();
                    if(E.split("Uncaught ")[1].split(":")[0].trim() == et)
                        this.native.toast(`${e}\nat\t${f} on line ${l}`);
                }
            }else{
                window.onerror = function(e,f,l){
                    var E = e.toString();
                    if(E.split("Uncaught ")[1].split(":")[0].trim() == et)
                        console.error(`${e}\nat\t${f} on line ${l}`);
                }
            }
        }
    }
}