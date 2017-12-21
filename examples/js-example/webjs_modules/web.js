export const modules = {};
export const $ = window.$;
export var body = document.body;
export function styleSheet(location){
    $("head").append("<link rel='stylesheet' type='text/css' href="+location+">");
}
export function build(path){
    $("head").append("<script src='"+path+".js'></script>");
}
export function use(id){
    build("WTS/"+id);

    return modules[id]
}

export function print(...args){
    document.write(...args);
}

export function entry(func){
    // document.addEventListener('deviceready', func, false);
    var app = new func()

    app.main()

    console.log(app)
}