exports.server = function (srv){
    var http = require('http'),
    path = require('path'),
    url = require('url'),
    ws = require('websocket'),
    fs = require('fs');
    // console.log("In here");
    var websocket = new ws.server({httpServer:srv});
    // var websocket = require('websocket');
    // var ws = new websocket.server({
    //     httpServer: srv;
    // });
    // ws.on("request",function(request){
    //     var connection = request.accept('WJS_APP',request.origin);
    //     connection.on("message",function(msg){
    //         var m = msg.utf8Data;
    //         if(m)
    //     })
    // })
    if(!fs.existsSync('wjs.wjsdb')) fs.writeFileSync('wjs.wjsdb','{}');
    var config = {};
    websocket.on("request",function(r){
        var connection = r.accept('',r.origin);
        var stream = fs.readFileSync('AlanWalker-X.mp3');
        connection.send(new Buffer(stream));
    })
    srv.on("request",function(request,response){
        var responseText = '';
        if(request.method == 'GET'){
            var name = request.url.split('?')[0].split('/')[1];
            // var descriptor = request.url.split(request.url.split('?')[0])[1];
            responseText = (JSON.parse(fs.readFileSync('wjs.wjsdb'))[name]||'null');
        }
        else if(request.method == 'POST'){
            var name = request.url.split('?')[0].split('/')[1];
            var descriptor = request.url.split(request.url.split('?')[0])[1].split('?')[1];
            config[name] = descriptor;
            fs.writeFileSync('wjs.wjsdb',JSON.stringify(config));
            // console.log(name,descriptor);
            responseText = 'success';
        }
        response.write(responseText,'binary');
        // console.log(responseText)
        // Object.getOwnPropertyNames(response).forEach(index => {
        //     console.log(index);
        // })
        // console.log(response._headers);
        // request.rawHeaders.push('Allow')
        response.end();
        // websocket.on("request",function(r){
        //     var conn = r.accept('WJS_APP',r.origin);
        //     var config = JSON.parse(fs.readFileSync('wjs.wjsdb'));
        //     if(request.method == 'GET'){
        //         var name = request.url.split('?')[0].split('/')[1];
        //         // var descriptor = request.url.split(request.url.split('?')[0])[1];
        //         conn.send(JSON.stringify(config[name]));
        //     }
        //     else if(request.method == 'POST'){
        //         var name = request.url.split('?')[0].split('/')[1];
        //         var descriptor = request.url.split(request.url.split('?')[0])[1];
        //         config[name] = descriptor;
        //         fs.writeFileSync(JSON.stringify(config));
        //         console.log(name,descriptor);
        //     }
        // })
    })
}