(<any>window).WJS_APP_NAMESPACE = {}

class WJSWebSocket extends WebSocket{
    constructor(addr,proto: string | string[]){
        super(addr,proto);
    }

    private f(s, callback) {
        var event = s.trim().toLowerCase();
        if (event == 'message') {
            this.onmessage = callback;
        } else if (event == 'connection') {
            this.onopen = callback;
        } else if (event == 'close') {
            this.onclose = callback;
        } else if (event == 'error') {
            this.onerror = callback;
        } else {
            this.addEventListener(event, callback);
        }
    }

    on(str, cb) {
        this.f(str,cb);
    }

    emit(eventName) {
        var event = new Event(eventName);
        this.dispatchEvent(event);
    }
}

export function load(root : HTMLElement,appClass){
    var application = new appClass(root);
    application.onViewLoad();
}

export function title(title: string){
    var t = document.createElement("title")

    t.innerText = title

    document.head.appendChild(t)
}

export var events = {
    bind : function(element: any) {
        if (!element) {
            throw new TypeError('Element supplied cannot be of type "null"')
        }
        element.on = function(ev:string, cb: Function) {
            if (!ev) {
                throw new TypeError('Argument supplied cannot be of type "null"')
            }
            element.addEventListener(ev,cb);
        }
        element.emit = function(ev: string) {
            if (!ev) {
                throw new TypeError('Argument supplied cannot be of type "null"')
            }
            var event = new Event(ev);
            element.dispatchEvent(event);
        }
        return element;
    },
    strip : function(element: any) {
        if (!element) {
            throw new TypeError('Element supplied cannot be of type "null"')
        }
        element.on = undefined;
        element.emit = undefined;
        return element;
    }
}

export function parseHTML(string: string) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(string, "text/html");
    return doc;
}

export function JSX(fu: Function, ...args: any[]) {
    if (typeof fu != "function") {
        throw new TypeError("Argument must be a JSX function");
    }
    var r = fu(...args);
    if (r) {
        var div = document.createElement("div");
        var arr = parseHTML(r).body.children
        for(var i=0;i<arr.length;i++){
            div.appendChild(arr[i]);
        }
        return div
    }
}


export function isNativeEnvironment(){
    return (<any>window).native?true:false;
}

export function nativeCallback(fn){
    return URL.createObjectURL(new Blob(["("+fn+")()"]));
}

export function store(name,data){
    (<any>window).WJS_APP_NAMESPACE[name] = data;
}

export function get(name){
    return (<any>window).WJS_APP_NAMESPACE[name];
}

export function stream (arr: any) {
    var s :any = {};
    if (typeof arr == 'object' && arr[0] != undefined) {
        s.pipe = function(dest) {
            arr.forEach(function(val) {
                dest(val);
            })
        }
    } else {
        throw new TypeError('Argument must be an array');
    }
    return s;
}

export function socket(proto? : string) {
    if (!proto) {
        console.warn('No protocol supplied for websocket instance');
    }
    return {
        connect: function(address){
            return new WJSWebSocket((address.startsWith('ws://'))?address:'ws://'+address,proto);
        }
    };
}

export class TemplatePage {
    public root : HTMLElement
    public template : string
    public onTemplateLoad : Function
    constructor(root : HTMLElement){
        this.root = root;
        console.log("Ready")
    }

    onViewLoad(){
        this.root.innerHTML = this.template
        this.onTemplateLoad();
    }
}