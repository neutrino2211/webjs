var e = ['nav', 'input', 'video', 'image', 'form', 'audio'];
this.elements = e;
this.bodyElement;
this.layout = document;
export function load(appClass){
    var application = new appClass();
    application.onViewLoad();
}

export function title(title){
    var t = document.createElement("title")

    t.title = title

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
    if (Array.isArray(arr)) {
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
        } else {
            throw new Error(`${st} is not a valid app object`);
        }
    }
    if (typeof str == 'string' && e.indexOf(str)) {
        return elem(str);
    } else {
        throw new Error('Argument must be of type string and must be included in available features \'app.elements\'')
    }
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
        var event = s.trim().toLowerCase();
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
