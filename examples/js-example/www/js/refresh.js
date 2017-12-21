var ws = new WebSocket("ws://localhost:3100");
ws.onopen = function(){
    ws.onmessage = function(msg){
        if(msg.data == "refresh"){
            window.location.reload()
        }else if(msg.data == "initial"){
            window.location.reload();
        }
    
        // window.location.reload()
    }
}