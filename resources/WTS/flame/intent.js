// var intentBridge = new WebSocket("ws://localhost:8888");
export class FlameError extends Error{
    /**
     * 
     * @param {String} message 
     */
    constructor(message){
        super(message);
    }

    show(){
        console.log(`${this.name} at ${this.stack} says ${this.message}`);
    }
}



export class Intent{
    /**
     * 
     * @param {Object} intent 
     * @param {String} intentTarget 
     */
    constructor(intent,intentTarget){
        var IntentClass = this;
        this.intentTarget = intentTarget;
        this.intent       = intent
        this.intentBridge = new WebSocket("ws://localhost:6678");
        this.intentstate = 0;
        this.intentBridge.onopen = function(){
            IntentClass.intentstate = 1;
            IntentClass.start()
        }
    }

    
    onfinish(){
        console.log("Intent executed")
    }

    start(){
        var Super = this;
        if(this.intentstate == 0){
            throw new FlameError("Intent not ready")
        }else{
            this.intentBridge.send(JSON.stringify({
                auth: Super.intentTarget,
                message: JSON.stringify(Super.intent)
            }))

            console.log("Intent sent")
    
            this.intentBridge.onmessage = function(data){
                var reply = JSON.parse(data.data);
                if(reply.auth == Super.intentTarget){
                    Super.onFinish(reply.message)
                    console.log("Reply recieved")
                }
            }
        }
    }
}

export var intents = {
    SYSTEM_USER_ACCOUNTS_MANAGER: "%UAM%",

}