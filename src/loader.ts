import * as ora from "ora";

export interface Task {
    name: string;
    text: string;
    spinner?: string;
}

export class Chain<T> {
    public list:T[] = [];
    private listIndex = 0;
    constructor(private cb: (prev:T,current:T)=>any, private fin: (t:T)=>void,private fail?: (list: T[])=>void){}

    next(){
        if(this.listIndex > this.list.length){
            throw new Error("No elements left")
        }
        if(this.listIndex == 0){
            this.cb(undefined,this.list[this.listIndex])
        } else {
            this.cb(this.list[this.listIndex-1],this.list[this.listIndex])
        }

        this.listIndex++;
    }

    finish(){
        this.fin(this.list[this.listIndex-1])
    }

    failed(error){
        if(this.fail){
            this.fail(this.list.slice(this.listIndex-1))
        } else {
            console.error("An error occurred chain step "+this.listIndex)
        }
        console.log("Reason ["+error.name+"] => "+error.message)
    }
}

export class Loader {
    ora: ora.Ora;
    constructor(options?: ora.Options){
        this.ora = ora(options);
    }

    start(text?: string){
        this.ora.start(text)
    }

    succeed(){
        this.ora.succeed();
    }

    fail(){
        this.ora.fail();
    }
}