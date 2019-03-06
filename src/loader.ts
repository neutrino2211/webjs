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

    get current(): T {
        return this.list[this.listIndex-1]
    }

    get done(): boolean {
        return this.listIndex==this.list.length
    }

    skip(){
        this.listIndex++;
        return this
    }

    repeat(){
        this.listIndex--;
        return this.next()
    }

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
        return this
    }

    restart(){
        this.listIndex = 0;
        return this
    }

    finish(){
        this.fin(this.list[this.listIndex-1])
        return this
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

export class AsyncChain<T> {
    public list:T[] = [];
    private listIndex = 0;
    constructor(private cb: (prev:T,current:T)=>any, private fin: (t:T)=>void,private fail?: (list: T[])=>void){}

    get current(): T {
        return this.list[this.listIndex-1]
    }

    get done(): boolean {
        return this.listIndex==this.list.length
    }

    async skip(){
        this.listIndex++;
        return this
    }

    async repeat(){
        this.listIndex--;
        return this;
    }
    
    async next(){
        if(this.listIndex > this.list.length){
            throw new Error("No elements left")
        }
        if(this.listIndex == 0){
            await this.cb(undefined,this.list[this.listIndex])
        } else {
            await this.cb(this.list[this.listIndex-1],this.list[this.listIndex])
        }

        this.listIndex++;
        return this
    }

    async restart(){
        this.listIndex = 0;
        return this
    }

    async finish(){
        await this.fin(this.list[this.listIndex-1])
        return this
    }

    async failed(error){
        if(this.fail){
            await this.fail(this.list.slice(this.listIndex-1))
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

    succeed(text?){
        this.ora.succeed(text);
    }

    fail(){
        this.ora.fail();
    }
}