var fs     = require("fs")
var url    = require("url")
var path   = require("path");
var http   = require("http");
var chalk  = require("chalk");
var server = http.createServer();

var res;

exports.Source = "";

exports.Start  = function(port){
    server.on("request",function(request,response){
        var uri = url.parse(request.url).pathname;
        var filename = path.join(exports.Source,uri);
        var status = 200;
        var responseText = '';
        // res = response;
        // console.log(request.url)
        if(!fs.existsSync(filename)){
            response.writeHead(404);
            response.end();
            console.log(`${chalk.magenta(`[${Date()}]`)}   ${chalk.red(`${404}: ${filename} not found;`)}`)
            return
        }
        if(request.url != "/favicon.ico" && fs.statSync(filename).isDirectory()) filename+='index.html';
        // if(!fs.existsSync(filename)){
        //     response.writeHead(404);
        //     response.end();
        //     console.log(`${chalk.magenta(`[${Date()}]`)}   ${chalk.red(`${status}: ${filename} not found;`)}`)
        //     return
        // }
        // if(status == 404){
        //     var page404 = fs.readFileSync(path.join(__dirname,'404.html'))
        //     responseText = page404;
        //     
        // }
        // else{
        //     responseText = fs.readFileSync(filename);
        //     console.log(`${chalk.magenta(`[${Date()}]`)}   ${chalk.yellow(`${status}: ${filename} served;`)}`)
        // }
        // console.log(request.url)
        if(request.url == "/favicon.ico"){
            response.writeHead(200)
            response.write(fs.readFileSync(path.join(__dirname,"favicon.ico")),"binary")
            response.end()
        } else {
            try{
                response.writeHead(status);
                responseText = fs.readFileSync(filename);
                console.log(`${chalk.magenta(`[${Date()}]`)}   ${chalk.yellow(`${status}: ${filename} served;`)}`)
                response.write(responseText,'binary');
                response.end();
            }catch(e){
                response.writeHead(404)
                console.log(`${chalk.magenta(`[${Date()}]`)}   ${chalk.yellow(`${status}: ${filename} served;`)}`)
                response.end();
            }
        }
    })
    server.on("error", (err) => {
        console.log(err.message)
    })
    server.listen(port)

    return server;
} 

// var ev = new Event("deviceready")