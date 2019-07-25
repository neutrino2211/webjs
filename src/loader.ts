import * as ora from "ora";

export interface Task {
    name: string;
    text: string;
    spinner?: string;
}
/**
 * @class `Chain` The chain class takes a list of elements of type `T` and manages the sequence of execution for the element handlers
 * 
 * ```typescript
 * var addition = 0;
 * const chain = new Chain<number>(
 *     (previousElement, currentElement) => {
 *         if(previousElement){
 *             addition += previousElement;
 *         }
 *         addition += currentElement;
 *     },
 *     (finalElement) => {
 *         addition += finalElement;
 *     }
 * );
 * chain.list = [0,1,2,3,4,5];
 * chain.next()
 * .next()
 * .next()
 * .next()
 * .next()
 * .finish();
 * 
 * chain.done // true
 * ```
 */
export class Chain<T> {

    /**
     * @public `list` The list of data the chain will operate on
     */
    public list:T[] = [];

    /**
     * @private `listIndex` Index of current element, useful for restarting, skipping and taking steps back
     */
    private listIndex = 0;

    /**
     * @constructor
     * @param cb Handler function for `.next()` steps
     * @param fin Handler function for `.finish()`
     * @param fail Handler function for `.fail()`
     */
    constructor(private cb: (prev:T,current:T)=>any, private fin: (t:T)=>void,private fail?: (list: T[])=>void){}

    /**
     * Getter function for the current item
     * @returns `T`
     */
    get current(): T {
        return this.list[this.listIndex-1]
    }

    /**
     * Getter function for the `done` boolean
     * @returns `boolean`
     */
    get done(): boolean {
        return this.listIndex==this.list.length
    }

    /**
     * Jumps to the next element on the list
     */
    skip(){
        this.listIndex++;
        return this
    }

    /**
     * Repeat operation performed on the current element
     */
    repeat(){
        this.listIndex--;
        return this.next()
    }

    /**
     * Perform next step of operations
     */
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

    /**
     * Return to the first element in the list
     */
    restart(){
        this.listIndex = 0;
        return this
    }

    /**
     * Call the `finish` callback specified in the constructor
     */
    finish(){
        this.fin(this.list[this.listIndex-1])
        return this
    }

    /**
     * Call fail callback if it exists, else log the error
     * @param error [Error] The error object
     */
    failed(error){
        if(this.fail){
            this.fail(this.list.slice(this.listIndex-1))
        } else {
            console.error("An error occurred in chain step "+this.listIndex)
        }
        console.log("Reason ["+error.name+"] => "+error.message)
    }
}

/**
 * @class `AsyncChain` implements the same methods as `Chain` but as asynchronous procedures
 */
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

/**
 * @class `Loader` is a wrapper around the `ora.Ora` class
 */
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