/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export body */
/* unused harmony export styleSheet */
/* harmony export (immutable) */ __webpack_exports__["b"] = build;
/* unused harmony export use */
/* unused harmony export print */
/* unused harmony export entry */
const modules = {};
/* harmony export (immutable) */ __webpack_exports__["c"] = modules;

const $ = window.$;
/* harmony export (immutable) */ __webpack_exports__["a"] = $;

var body = document.body;
function styleSheet(location){
    $("head").append("<link rel='stylesheet' type='text/css' href="+location+">");
}
function build(path){
    $("head").append("<script src='"+path+".js'></script>");
}
function use(id){
    build("WTS/"+id);

    return modules[id]
}

function print(...args){
    document.write(...args);
}

function entry(func){
    // document.addEventListener('deviceready', func, false);
    var app = new func()

    app.main()

    console.log(app)
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = load;
/* unused harmony export title */
/* unused harmony export events */
/* harmony export (immutable) */ __webpack_exports__["b"] = parseHTML;
/* unused harmony export createPageRoot */
/* unused harmony export JSX */
/* unused harmony export stream */
/* unused harmony export add */
/* unused harmony export jQ */
/* unused harmony export socket */
/* unused harmony export layout */
/* unused harmony export openPage */
/* unused harmony export loadJSX */
/* unused harmony export globalModule */
/* unused harmony export append */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core__ = __webpack_require__(0);


// var require : any;
var process ;
var pageRoot;
var bodyElement;
var e = ['nav', 'input', 'video', 'image', 'form', 'audio'];
this.elements = e;
this.bodyElement;
this.layout = document;
this.loadBackend = function(path){
    if(typeof process == "object"){
        Object(__WEBPACK_IMPORTED_MODULE_0_core__["b" /* build */])(path);
    }else{
        console.log("Environment does not support backend")
    }
}

function load(appClass){
    var application = new appClass();
    application.onViewLoad();
}

function title(title){
    var t = document.createElement("title")

    t.title = title

    document.head.appendChild(t)
}

var events = {
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
function parseHTML(string) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(string, "text/html");
    return doc;
}
function createPageRoot(){
    var iframe = document.createElement("iframe");
    // iframe.style.border = "0"
    iframe.style.overflow = "hidden";
    iframe.style.height = (window.innerHeight-10)+"px";
    iframe.style.width  = "100%";
    iframe.style.paddingTop = (window.innerHeight/10)+"px";

    Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])(bodyElement).append(iframe)
    pageRoot = iframe;
    // iframe.contentWindow
}
function JSX(fu, ...args) {
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
function stream (arr) {
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
function add (str) {
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
function jQ(e) {
    return Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])(e);
}
function socket(proto) {
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
function layout (element) {
    bodyElement = element;
}
function openPage (page) {
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
function loadJSX(jsx) {
    Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])(bodyElement).append(jsx);
}
function globalModule(m) {
    var properties = Object.getOwnPropertyNames(__WEBPACK_IMPORTED_MODULE_0_core__["c" /* modules */][m]);
    properties.forEach(function(p) {
        window[p] = __WEBPACK_IMPORTED_MODULE_0_core__["c" /* modules */][m][p];
    })
}
function append (element) {
    Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])(bodyElement).append(element)
};


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_wjs_app__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__webjs_modules_definitions__ = __webpack_require__(3);
//Declare imports here.





class Reflex{
    constructor(html){
        this.__html = html;
    }

    render(tag){
        var b = Object(__WEBPACK_IMPORTED_MODULE_1_wjs_app__["b" /* parseHTML */])(this.__html).body.children;
        var tags = document.getElementsByTagName(tag);

        for(var i=0;i<tags.length;i++){

            for(var j=0;j<b.length;j++){
                tags[i].appendChild(b[j]);
            }
        }
    }
}

class Application extends __WEBPACK_IMPORTED_MODULE_2__webjs_modules_definitions__["a" /* TemplateApplication */]{
    constructor(){
        super()

        this.myCustomTag = new Reflex(`
            <div class="blue card" style="width:50%;height:50%;margin:25%;">
                <p>Hello</p>
            </div>
        `);

        this.template = `
            <h1>Hello</h1>
            <Reflex/>
        `;
    }
    
    //Your apps entry point
    onTemplateLoad(){
        this.myCustomTag.render("Reflex");
    }
}

__WEBPACK_IMPORTED_MODULE_1_wjs_app__["a" /* load */](Application)
        

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export WJSModule */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core__ = __webpack_require__(0);


function WJSModule(options){
    Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])(document.body).load(options.template.startsWith("/") ? options.template : "/"+options.template);
    var p = new options.controller(document);
    (options.styleSheets ? options.styleSheets : []).forEach(function(element) {
        var css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = element;
        document.head.appendChild(css);
    }, this);
    document.body.onload = ()=>{
        p.onViewLoad();
    }
}

class TemplateApplication{
    constructor(){
        console.log("Ready")
        document.addEventListener("__INIT__",()=>{
            this.onTemplateLoad();
        });
    }

    onViewLoad(){
        Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])("body").append(this.template)
        document.dispatchEvent(new Event("__INIT__"))
        // this.ovl();
        // window.WJS_PAGE_STATE = 1;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TemplateApplication;


class TemplateApplicationPage{
    /**
     * 
     * @param {HTMLElement} element 
     */
    constructor(element){
        this.element = element;
        if(window.openPage){
            window.openPage.close()
        }
        window.openPage = this;
        console.log("page created")
    }
    close(){
        this.isClosed = true;
        this.element.innerHTML = ""
    }
}
/* unused harmony export TemplateApplicationPage */


/***/ })
/******/ ]);