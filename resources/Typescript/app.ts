import { $ } from "./web";

export function load(appClass){
    var application = new appClass();
    application.onViewLoad();
}

export function title(title: string){
    var t = document.createElement("title")

    t.title = title

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

export function socket(proto) {
    if (!proto) {
        console.warn('No protocol supplied for websocket instance');
    }
    var self = {};
    self.connect = function(addr) {
        if (!addr) {
            throw new URIError('Address cannot be null');
        }
        var socket = new WebSocket(`${(addr.startsWith('ws://'))?addr:'ws://'+addr}`, proto);
        function f(s, callback) {
            var event = s.trim().toLowerCase();
            if (event == 'message') {
                socket.onmessage = callback;
            } else if (event == 'connection') {
                socket.onopen = callback;
            } else if (event == 'close') {
                socket.onclose = callback;
            } else if (event == 'error') {
                socket.onerror = callback;
            } else {
                socket.addEventListener(event, callback);
            }
        }
        socket.emit = function(eventName) {
            var event = new Event(eventName);
            socket.dispatchEvent(event);
        }
        socket.on = function(str, cb) {
            f(str,cb);
        }
        return socket;
    }
    return self;
}