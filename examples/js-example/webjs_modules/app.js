import { build,$,modules } from "./web";

// var require : any;
// var process ;
// var pageRoot;
// var bodyElement;
// var e = ['nav', 'input', 'video', 'image', 'form', 'audio'];
// this.elements = e;
// this.bodyElement;
// this.layout = document;
// this.loadBackend = function(path){
//     if(typeof process == "object"){
//         build(path);
//     }else{
//         console.log("Environment does not support backend")
//     }
// }

export function load(appClass){
    var application = new appClass();
    application.onViewLoad();
}

export function title(title){
    var t = document.createElement("title")

    t.innerText = title

    document.head.appendChild(t)
}

export var events = {
    bind : function(element) {
        if (!element) {
            throw new TypeError('Element supplied cannot be of type "null"')
        }
        element.on = function(ev, cb) {
            if (!ev) {
                throw new TypeError('Argument supplied cannot be of type "null"')
            }
            element.addEventListener(ev, cb);
        }
        element.emit = function(ev) {
            if (!ev) {
                throw new TypeError('Argument supplied cannot be of type "null"')
            }
            var event = new Event(ev);
            element.dispatchEvent(event);
        }
        return element;
    },
    strip : function(element) {
        if (!element) {
            throw new TypeError('Element supplied cannot be of type "null"')
        }
        element.on = undefined;
        element.emit = undefined;
        return element;
    }
}
    // this.appLayout = function(element){
    //     element.wjs = true;
    // }
    // this.append = function(element){

// }
// this.append = function(obj) {
//     if (!obj) throw new TypeError('Argument must be a valid js object');
//     if (typeof obj !== 'object' && obj.wjs != true) throw new TypeError('Argument must be a valid wjs UI object');
//     this.layout.appendChild(obj);
//     $(obj).css(obj.configUI);
//     this.events.bind(obj);
// }
export function parseHTML(string) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(string, "text/html");
    return doc;
}
export function createPageRoot(){
    var iframe = document.createElement("iframe");
    // iframe.style.border = "0"
    iframe.style.overflow = "hidden";
    iframe.style.height = (window.innerHeight-10)+"px";
    iframe.style.width  = "100%";
    iframe.style.paddingTop = (window.innerHeight/10)+"px";

    $(bodyElement).append(iframe)
    pageRoot = iframe;
    // iframe.contentWindow
}
export function JSX(fu, ...args) {
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
export function stream (arr) {
    var s = {};
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
export function add (str) {
    function elem(s) {
        var st = s.trim().toLowerCase();
        if (st == 'nav') {
            var nav = document.createElement('nav');
            nav.className = 'nav';
            nav.style.height = '7%';
            nav.style.color = 'blue';
            document.body.appendChild(nav);
            return nav;
        } else if (st == 'input') {
            var input = document.createElement('input');
            input.className = 'form-control';
            input.autocomplete = 'true';
            input.spellcheck = true;
            document.body.appendChild(input);
            return input;
        } else if (st == 'video') {
            var video = document.createElement('video');
            video.style.width = '55%';
            video.style.height = '30%';
            video.controls = true;
            document.body.appendChild(video);
            return video;
        } else if (st == 'image') {
            var img = document.createElement('img');
            img.alt = 'WJS image';
            document.body.appendChild(img);
            return img;
        } else if (st == 'form') {
            var form = document.createElement('form');
            form.action = 'POST';
            form.inputs = [];
            form.addInput = function(inputNode) {
                form.appendChild(inputNode);
                form.inputs.push(inputNode);
            }
            form.rules = function(rules) {
                if (typeof rules == 'object') {
                    form.inputs.forEach(function(input) {
                        input.spellcheck = rules.spellcheck;
                        input.maxLength = rules.maxLength;
                        input.minLength = rules.minLength;
                        input.autocomplete = rules.autocomplete;
                        input.autofocus = rules.autofocus;
                        input.required = rules.required;
                    })
                } else {
                    throw new TypeError('Argument must be a valid js object');
                }
            }
            document.body.appendChild(form);
            return form;
        } else if (st == 'audio') {
            var audio = document.createElement('audio');
            audio.autoplay = true;
            audio.controls = true;
            document.body.appendChild(audio);
            return audio;
        } else if(st == "stylesheet"){
            var link = document.createElement("link");
            document.head.appendChild(link);
            return link;
        } else {
            throw new Error(`${st} is not a valid app object`);
        }
    }
    if (typeof str == 'string') {
        return elem(str);
    } else {
        throw new Error('Argument must be of type string .');
    }
}
export function jQ(e) {
    return $(e);
}
export function socket(proto) {
    if (!proto) {
        console.warn('No protocol supplied for websocket instance');
    }
    var sock = {};
    this.connect = function(addr) {
        if (!addr) {
            throw new URIError('Address cannot be null');
        }
        sock = new WebSocket(`${(addr.startsWith('ws://'))?addr:'ws://'+addr}`, proto);
    }

    function f(s, callback) {
        var event = s.trim();
        if (event == 'message') {
            sock.onmessage = callback;
        } else if (event == 'connection') {
            sock.onopen = callback;
        } else if (event == 'close') {
            sock.onclose = callback;
        } else if (event == 'error') {
            sock.onerror = callback;
        } else {
            sock.addEventListener(event, callback);
        }
    }
    this.close = sock.close;
    this.state = sock.readyState;
    this.emit = function(eventName) {
        var event = new Event(eventName);
        sock.dispatchEvent(event);
    }
    this.on = function(str, cb) {
        if (typeof str == 'string') {
            f(str, cb);
        } else {
            throw new TypeError('Argument is not a string');
        }
    }
    return this;
}
export function layout (element) {
    bodyElement = element;
}

export function openPage (page) {
    // $(bodyElement).html((page.endsWith(".js") ? page : page+'.js'));
    var co = document.createElement("div");
    co.className = "cssload-container";
    var wh = document.createElement("div");
    wh.className = "cssload-whirlpool";
    co.appendChild(wh);
    co.style.zIndex = "999";
    document.body.appendChild(co);
    var dir = page.template.split(".html")[0];

    pageRoot.src = "pages/"+dir+"/"+page.template;
    var mjs = document.createElement("script");
    mjs.src = '../../js/materialize.js';
    var bjs = document.createElement("script");
    bjs.src = '../../js/bootstrap.js';
    var jqjs = document.createElement("script");
    jqjs.src = '../../js/jquery-3.1.1.min.js';
    var jcjs = document.createElement("script");
    jcjs.src = '../../js/jQuery-color.js';
    var mcss = document.createElement("link");
    mcss.href = '../../css/materialize.min.css';
    mcss.rel = 'stylesheet';
    var bcss = document.createElement("link");
    bcss.href = '../../css/bootstrap.min.css';
    bcss.rel = 'stylesheet';
    var fcss = document.createElement("link");
    fcss.href = '../../css/font-awesome.css';
    fcss.rel = 'stylesheet';
    // console.log(pageRoot.contentWindow)
    setTimeout(()=>{
        var pd = pageRoot.contentWindow.document.body;
        // pd.style.overflow = "hidden";
        pd.appendChild(jqjs);
        pd.appendChild(mjs);
        pd.appendChild(bjs);
        pd.appendChild(jcjs);
        pd.appendChild(mcss);
        pd.appendChild(bcss);
        pd.appendChild(fcss);
        var pageClass = new page.engine(pageRoot.contentWindow);
        co.remove()
    },1000)
}
export function loadJSX(jsx) {
    $(bodyElement).append(jsx);
}
export function globalModule(m) {
    var properties = Object.getOwnPropertyNames(modules[m]);
    properties.forEach(function(p) {
        window[p] = modules[m][p];
    })
}
export function append (element) {
    $(bodyElement).append(element)
};
