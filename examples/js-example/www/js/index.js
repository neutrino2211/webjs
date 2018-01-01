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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
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
/* harmony export (immutable) */ __webpack_exports__["c"] = title;
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

    t.innerText = title

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
    Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])(document.body).ready(function(){
        p.onViewLoad();
    })
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
/* unused harmony export TemplateApplication */


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


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export icons */
/* unused harmony export createElementClass */
/* unused harmony export setElementClass */
/* unused harmony export introduceElement */
/* unused harmony export floatingActionButton */
/* unused harmony export ui */
/* unused harmony export colors */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core__ = __webpack_require__(0);


function icons(name){
    var icon = document.createElement("i");
    icon.innerText = name;
    icon.className = "material-icons";
    icon.style.height = "100%";

    return icon;
}

var materialClasses = {};

/**
 * 
 * @param {String} name 
 * @param {Object} rules 
 */

function createElementClass(name,rules){
    materialClasses[name] = rules;
}

/**
 * 
 * @param {HTMLElement} element 
 * @param {String} name 
 */

function setElementClass(element,name){
    var rules = materialClasses[name];

    Object.getOwnPropertyNames(rules).forEach((name)=>{
        element.style[name] = rules[name];
    })

    return element
}

/**
 * @param {HTMLElement} parent
 * @param {HTMLElement} element 
 */

function introduceElement(element,parent){

    var initialH = element.style.height;
    var initialW = element.style.width;

    element.style.width = "0px";
    element.style.height = "0px";

    if(parent){
        parent.appendChild(element)
    }else{
        document.body.appendChild(element)
    }

    Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])(element).animate({
        height: initialH,
        width : initialW
    },400)
}

function floatingActionButton(obj) {
    var btn = document.createElement("div");
    btn.className = `fixed-action-btn ${obj.position ? obj.position : "right" } ${obj.type||""}`
    var a = document.createElement("a");
    a.className = `btn-floating btn-${obj.size} ${obj.color}`;
    var i = obj.icon||document.createElement("i");
    // i.innerText = obj.icon||"";
    var ul = document.createElement("ul")
    btn.appendChild(a);
    a.appendChild(i);
    if (!obj.fab) {
        return btn;
    }

    obj.fab.forEach(function(fab) {
        var li = document.createElement("li");
        li.className = "waves-effect";
        li.appendChild(fab)
        ul.appendChild(li);
    })
    btn.appendChild(ul);
    return btn;
}

var ui = {
    card: function(){
        var d = document.createElement("div");
        d.className = "card";

        return d
    },
    /**
     * 
     * @param {Array<HTMLElement>} elements 
     * 
     * @returns {HTMLDivElement}
     */
    row: function(elements){
        var rowDiv = document.createElement("div");
        // rowDiv.style.display = "inline-block";
    
        if(!elements){
            elements = []
        }
    
        elements.forEach((e)=>{
            e.style.display = "inline-block";
            rowDiv.appendChild(e)
        })
    
        return rowDiv
    }
}

var colors = {
    red: "#f44336",
    blue: "#2196F3",
    pink: "#E91E63",
    cyan: "#00BCD4",
    teal: "#009688",
    lime: "#CDDC39",
    brown: "#795548",
    amber: "#FFC107",
    green: "#4CAF50",
    orange: "#FF9800",
    yellow: "#FFEB3B",
    indigo: "#3F51B5",
    violet: "#673AB7",
    purple: "#9C27B0",
    warning: "#FF5722",
    blueAccent: "#03A9F4",
    greenAccent: "#8BC34A",
    random : function(){
        var colorLength = Object.getOwnPropertyNames(colors).length;
        var colorMap = [];
        Object.getOwnPropertyNames(colors).forEach((name,index)=>{
            colorMap[index] = name;
        })

        var i = Math.round(Math.random()*(colorLength-1));

        console.log(colors[colorMap[i]])

        return colors[colorMap[i]]||colors.red
    }

}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Divider */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Button3; });
/* unused harmony export Button2 */
/* unused harmony export Button1 */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return Nav; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return Input; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return Footer; });
/* unused harmony export LargeDiv */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return Test; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return Skill; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return InfoCard; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return Header; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return FloatingActionButton; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return TransitioningFloatingActionButton; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__reflex_module__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__ = __webpack_require__(3);



var Divider = new __WEBPACK_IMPORTED_MODULE_0__reflex_module__["a" /* Reflex */].Component(`
<div class="divider"></div>
`);

var Button3 = new __WEBPACK_IMPORTED_MODULE_0__reflex_module__["a" /* Reflex */].Component(`
<button class="btn {{color}} {{class}}" style="color:white;margin-top:10px;margin-left:8%;width:22%;display:inline-block;">{{name}}</button>
`);

var Button2 = new __WEBPACK_IMPORTED_MODULE_0__reflex_module__["a" /* Reflex */].Component(`
<button class="btn {{color}} {{class}}" style="color:white;margin-top:10px;margin-left:9.5%;width:35%;display:inline-block;">{{name}}</button>
`);

var Button1 = new __WEBPACK_IMPORTED_MODULE_0__reflex_module__["a" /* Reflex */].Component(`
<button class="btn {{color}} {{class}}" style="color:white;margin-top:10px;margin-left:20%;width:60%;display:inline-block;">{{name}}</button>
`);

var Nav = new __WEBPACK_IMPORTED_MODULE_0__reflex_module__["a" /* Reflex */].Component(`
    <nav class="{{color}}"style="text-align:center;"><p class"text center {{text-color}}" style="font-family:monospace;font-size:27px;">{{title}}</p></nav>
`);

var Input = new __WEBPACK_IMPORTED_MODULE_0__reflex_module__["a" /* Reflex */].Component(`
    <input placeholder="{{placeholder}}" type="{{type}}" id="{{id}}" style="{{style}};width:90%;margin-left:5%;"></input>
`)

var Footer = new __WEBPACK_IMPORTED_MODULE_0__reflex_module__["a" /* Reflex */].Component(`
    <footer class="page-footer accent-color">
        <div class="container">
            <div class="row">
                <div class="col l6 s12">
                    <h5 class="white-text">About me</h5>
                    <p class="grey-text text-lighten-4">
                        I am a Cyber Security student at Federal University of Technology,Minna (Nigeria)<br/>
                        i deal mostly with network systems like servers and sockets using (nodejs , python , golang)
                    </p>
                </div>
                <div class="col l4 offset-l2 s12">
                    <h5 class="white-text">Social</h5>
                    <ul>
                        <li><a class="grey-text text-lighten-3" target="blank_" href="https://www.instagram.com/neutrino2211_/"><i class="fa fa-instagram" style="padding:5px;"></i>Instagram</a></li>
                        <li><a class="grey-text text-lighten-3" target="blank_" href="https://twitter.com/wjsCli_official"><i class="fa fa-twitter" style="padding:5px;"></i>Twitter (wjs)</a></li>
                        <li><a class="grey-text text-lighten-3" target="blank_" href="https://twitter.com/neutrino2211"><i class="fa fa-twitter" style="padding:5px;"></i>Twitter (personal)</a></li>
                        <li><a class="grey-text text-lighten-3" target="blank_" href="https://www.facebook.com/tsowa.mainasara"><i class="fa fa-facebook" style="padding:5px;"></i>Facebook</a></li>
                    </ul>
                </div>
                <div>Lacerta icon made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
            </div>
        </div>
        <div class="footer-copyright">
            <div class="container">
                &copy; 2018
            </div>
        </div>
    </footer>
`);

var LargeDiv = new __WEBPACK_IMPORTED_MODULE_0__reflex_module__["a" /* Reflex */].Component(`
    <div style="width:100%;height:100%;background-color:{{color}}">
        <img  class="circle" src="{{img-src}}" alt="Image" style="width:100px"></img>
    </div>
`);

var Test = new __WEBPACK_IMPORTED_MODULE_0__reflex_module__["a" /* Reflex */].Component(`
    <div class="default-primary-color"style="width:100%;height:100%;text-align:center;">
        <img src="{{src}}" width="180px" alt="Image" style="margin-top:19%;" class="circle app-hover-emphasis"></img>
        <p class="text-primary-color scale-transition scale-out header" id="my-name" style="font-size:25px">{{text}}</p>
    </div>
`)

var Skill = new __WEBPACK_IMPORTED_MODULE_0__reflex_module__["a" /* Reflex */].Component(`
    <div class="progress" style="width:50%;margin-left:25%;color:#ffffff;">
        <div class="determinate" style="width: {{level}}"><p style="text-align:center;">{{name}}</p></div>
    </div>
`)

var InfoCard = new __WEBPACK_IMPORTED_MODULE_0__reflex_module__["a" /* Reflex */].Component(`
<div class="col s12 m6" style="text-align:center;">
<img src="{{src}}" alt="{{title}}"></img>
<div class="card divider-color darken-1">
  <div class="card-content" style="color:#0097A7;">
    <span class="card-title">{{title}}</span>
    <p>{{description}}</p>
  </div>
  <div class="card-action">
    <a href="{{link}}" target="_blank">{{text}}</a>
  </div>
</div>
</div>
`)

var Header = new __WEBPACK_IMPORTED_MODULE_0__reflex_module__["a" /* Reflex */].Component(`
    <h2 class="text header center" id="header" style="color:#00796B;">{{text}}</h2>
`)

var FloatingActionButton = new __WEBPACK_IMPORTED_MODULE_0__reflex_module__["a" /* Reflex */].Component(`
    <div class="fixed-action-btn {{position}} {{type}}"><a class="btn-floating btn-{{size}} {{color}}"><i class="material-icons">{{icon}}</i></a></div>
`)

var TransitioningFloatingActionButton = new __WEBPACK_IMPORTED_MODULE_0__reflex_module__["a" /* Reflex */].Component(`
<div class="fixed-action-btn scale-transition scale-out {{type}}"><a class="btn-floating btn-{{size}} {{position}} {{color}}"><i class="material-icons" style="color:#0097A7;">{{icon}}</i></a></div>
`)

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Reflex; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_wjs_app__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core__ = __webpack_require__(0);



class component {
    /**
     * 
     * @param {String} html 
     */
    constructor(html){
        var self = this;
        this.__html = html;
        this.__parse = "";
    }

    render(tag,callback){
        this.__tag = tag;
        var self = this;
        var tags = document.getElementsByTagName(tag);        
        var d = this.__html.match(/{{([^}]+)}}/g);
        // console.log(d);
        d = d||[];
        // console.log(tags)
        // console.log(tags.length);
        for(var i=0;i<tags.length;i++){
            // console.log(i)
            // tags[i].innerHTML = "";
            d.forEach(function(t,l){
                var dd = t.slice(2,-2).trim();
                // if(dd.startsWith("?") && tags[i].getAttribute("@"+dd.slice(1))==null){
                //     if(l == 0){
                //         self.__parse = self.__html.replace(t,(tags[i].getAttribute("@"+dd)||""))
                //     }else{
                //         self.__parse = self.__parse.replace(t,(tags[i].getAttribute("@"+dd)||""))
                //     }
                // }
                // console.log(dd,tags[i].getAttribute("@"+dd))
                // if(tags[i].getAttribute("@"+dd) == null){
                //     var attrs = tags[i].attributes;

                //     for(var m=0;m<attrs.length;m++){
                //         if(attrs[m] == t){
                //             if(l == 0){
                //                 self.__parse = self.__html.replace(t,(tags[i].getAttribute("@"+dd)||""))
                //             }else{
                //                 self.__parse = self.__parse.replace(t,(tags[i].getAttribute("@"+dd)||""))
                //             }
                //         }
                //     }
                // }
                if(l == 0){
                    self.__parse = self.__html.replace(t,(tags[i].getAttribute("@"+dd)))
                }else{
                    self.__parse = self.__parse.replace(t,(tags[i].getAttribute("@"+dd)))
                }
                // console.log(e.getAttribute("reflex-"+dd),dd)
                // for(var k=0;k<e.attributes.length;k++){
                //     var a = e.attributes[k];
                //     var f = a.split("reflex-")[1];
    
                //     self.__html = self.__html.replace(t,obj[dd])
                // }
            })
            // console.log(tags[i])
            var b = Object(__WEBPACK_IMPORTED_MODULE_0_wjs_app__["b" /* parseHTML */])((self.__parse != "")?self.__parse:self.__html).body.children;
            console.log()
            for(var j=0;j<b.length;j++){
                // console.log(self.__parse);
                var attrs = b[j].attributes;
                // console.log(attrs.length)
                for(var m=0;m<attrs.length;m++){
                    // console.log(attrs[m].name)
                    if(attrs[m].nodeValue == "null"){
                        b[j].removeAttribute(attrs[m].name);
                    }
                }

                // $(tags[i]).append(b[j]);
                // tags[i].innerHTML = "";
                tags[i].appendChild(b[j])
                // tags[i] = tags[i+1]||tags[i]
                // return;
                // console.log(b[j])
            }
            if(tags[i].getAttribute("@href")){
                var t = tags[i];
                tags[i].onclick = function(){
                    var r = new HTMLRenderer(t.getAttribute("@href"));
                    // console.log(window.__renderers)
                    r.render(window.__renderers);
                }
            }else if(tags[i].getAttribute("@href-to")){
                var t = tags[i];
                tags[i].onclick = function(){
                    var r = new HTMLRenderer(t.getAttribute("@href-to"));
                    // console.log(window.__renderers)
                    r.renderTo(document.getElementById(t.getAttribute("@target")),window.__renderers);
                }
            }

            if(callback){
                callback(tags[i].children);
            }
            // console.log(tags[i])
            // document.body.appendChild(tags[i]);
        }
        // self.__parse = "";
    }
}

class HTMLRenderer {
    
    /**
     * @private this.__component_tag_list
     * @param {String} page 
     */

    constructor(page){
        this.__page = page;
        if(typeof native != "undefined"){
            this.__page = (page.startsWith("./")||page.startsWith("/"))?"file:///android_asset/"+page.split("/").slice(1).join(""):"file:///android_assets/"+page;
        }
        this.__component_tag_list = [];
        this.__component_list = [];
    }

    /**
     * 
     * @param {component} component 
     * @param {String} tag 
     */

    addComponentRenderer(component, tag){
        this.__component_tag_list.push(tag);
        this.__component_list.push(component);
    }

    render(...renderers){
        var self = this;
        window.__renderers = renderers;
        // window.__renderers = window.__renderers[0];
        // console.log(renderers)
        if(Array.isArray(renderers[0])){
            renderers = renderers[0];
            window.__renderers = renderers;
        }
        __WEBPACK_IMPORTED_MODULE_1_core__["a" /* $ */].get(this.__page,function(html){
            // console.log(html)
            // var doc = parseHTML(html);
            // console.log(doc);
            // document.body = doc.body;
            document.body.innerHTML = html;
            // self.__component_list.forEach(function(comp,i){
            //     console.log(self.__component_tag_list[i]);
            //     // var c = new component(comp.__html);
            //     comp.render(self.__component_tag_list[i]);
            //     // var tags = doc.getElementsByTagName(self.__component_tag_list[i])
            //     // comp.render(self.__component_tag_list[i]);
            // })
            // console.log(Array.from(window.__renderers));
            renderers.forEach(function(map){
                // console.log(map.component)
                // map.tag.do = map.onRender
                map.component.render(map.tag,map.onRender);
            })
        });
    }

    renderTo(el,...renderers){
        var self = this;
        window.__renderers = renderers;
        // window.__renderers = window.__renderers[0];
        console.log(renderers)
        if(Array.isArray(renderers[0])){
            renderers = renderers[0];
        }
        __WEBPACK_IMPORTED_MODULE_1_core__["a" /* $ */].get(this.__page,function(html){
            // console.log(html)
            // var doc = parseHTML(html);
            // console.log(doc);
            // document.body = doc.body;
            el.innerHTML = html;
            // self.__component_list.forEach(function(comp,i){
            //     console.log(self.__component_tag_list[i]);
            //     // var c = new component(comp.__html);
            //     comp.render(self.__component_tag_list[i]);
            //     // var tags = doc.getElementsByTagName(self.__component_tag_list[i])
            //     // comp.render(self.__component_tag_list[i]);
            // })
            // console.log(Array.from(window.__renderers));
            renderers.forEach(function(map){
                // console.log(map.component)
                map.component.render(map.tag);
            })
        });
    }
}

var Reflex = {
    Component: component,

    HTMLRenderer: HTMLRenderer
}

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_wjs_app__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__webjs_modules_definitions__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__webjs_modules_material__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_app_controller__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__reflex_module__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__reflex_component__ = __webpack_require__(4);
//Declare imports here.








class Application {
    constructor(){
        this.myCustomTag = new __WEBPACK_IMPORTED_MODULE_5__reflex_module__["a" /* Reflex */].Component(`
            <div class="blue card">
                <p>Hello</p>
            </div>
        `);
    }
    
    //Your apps entry point
    onViewLoad(){
        // document.body.style.background = "linear-gradient(#009688)";
        __WEBPACK_IMPORTED_MODULE_1_wjs_app__["c" /* title */]("Tsowa Mainasara Al-amin")
        document.body.style.overflowX = "hidden";
        // document.body.style.overflowY = "scroll";
        Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])("head").append("<link rel='stylesheet' href='pages/page.css'/>")
        function sms(number, message){
            if(typeof native !== "undefined"){
                native.sms(number,message);
            }else{
                console.error("Not deployed in android environment");
            }
        }

        function AnimateRotate(e,angle) {
            // caching the object for performance reasons
            var $elem = Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])(e);
        
            // we use a pseudo object for the animation
            // (starts from `0` to `angle`), you can name it as you want
            Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])({deg: 0}).animate({deg: angle}, {
                duration: 200,
                step: function(now) {
                    // in the step-callback (that is fired each step of the animation),
                    // you can use the `now` paramter which contains the current
                    // animation-position (`0` up to `angle`)
                    $elem.css({
                        transform: 'rotate(' + now + 'deg)'
                    });
                }
            });
        }

        var HomePage = new __WEBPACK_IMPORTED_MODULE_5__reflex_module__["a" /* Reflex */].HTMLRenderer("./pages/app.reflex.html");
        
        HomePage.render(
            {
                component: __WEBPACK_IMPORTED_MODULE_6__reflex_component__["c" /* Footer */],
                tag: "app-footer"
            },
            {
                component: __WEBPACK_IMPORTED_MODULE_6__reflex_component__["h" /* Skill */],
                tag: "skill",
                onRender(elements){
                    var animated = true;
                    var l = elements[0].children[0].style.width;
                    elements[0].children[0].style.width = "0%";
                    Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])(window).scroll(function(){
                        var $pos = Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])(window).scrollTop()+innerHeight;

                        // console.log($pos,$(elements[0]).offset().top)

                        if($pos > Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])(elements[0]).offset().top && animated){
                            Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])(elements[0].children[0]).animate({
                                width: l
                            },400);
                            animated = false;
                        }
                    })
                }
            },
            {
                component: __WEBPACK_IMPORTED_MODULE_6__reflex_component__["j" /* TransitioningFloatingActionButton */],
                tag: "app-transitioning-fab",
                onRender(element){
                    var deg = 0;
                    Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])(window).scroll(function(ev){
                        // console.log($(window).scrollTop())
                        var $pos = Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])(window).scrollTop();
                        // console.log($pos,$("#header").offset().top)
                        if($pos < Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])("#my-name").offset().top && deg != 0){
                            AnimateRotate(element[0],0);
                            deg = 0;
                        }else if($pos > Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])("#my-name").offset().top && deg != 180){
                            AnimateRotate(element[0],180);
                            deg = 180;
                        }
                    })

                    // console.log(element)
                    Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])(element[0]).click(function(){
                        deg = (deg == 180)?0:180;
                        AnimateRotate(element[0],deg);
                        if(deg != 0){
                            Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])('html,body').animate({ scrollTop: Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])("#header").offset().top }, 'slow');
                        }else{
                            Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])('html,body').animate({ scrollTop: 0 }, 'slow');
                        }
                        return false;
                    })
                    setTimeout(function(){
                        Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])(element[0]).removeClass("scale-out");
                    },500)
                }
            },
            {
                component: __WEBPACK_IMPORTED_MODULE_6__reflex_component__["i" /* Test */],
                tag: "app-large-div",
                onRender(elements){
                    // $(elements[0]).carousel();
                    setTimeout(function(){
                        Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])(elements[0].children[1]).removeClass("scale-out").addClass("scale-in");
                    },500);
                }
            },
            {
                component: __WEBPACK_IMPORTED_MODULE_6__reflex_component__["d" /* Header */],
                tag: "app-header"
            },
            {
                component: __WEBPACK_IMPORTED_MODULE_6__reflex_component__["e" /* InfoCard */],
                tag: "app-card"
            }
        );
    }
}

__WEBPACK_IMPORTED_MODULE_1_wjs_app__["a" /* load */](Application)
        

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__reflex_component__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_wjs_definitions__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core__ = __webpack_require__(0);




class Controller{
    /**
     * 
     * @param {HTMLDocument} doc 
     */
    constructor(doc){
        console.log("Ready");
        this.doc = doc;
    }

    onViewLoad(){
        alert("Loaded");
        __WEBPACK_IMPORTED_MODULE_0__reflex_component__["b" /* FloatingActionButton */].render("app-fab",this.doc);
        __WEBPACK_IMPORTED_MODULE_0__reflex_component__["a" /* Button3 */].render("app-button-3",this.doc);
        __WEBPACK_IMPORTED_MODULE_0__reflex_component__["f" /* Input */].render("app-input",this.doc);
        __WEBPACK_IMPORTED_MODULE_0__reflex_component__["g" /* Nav */].render("app-nav",this.doc);
    }
}
/* unused harmony export default */


/***/ })
/******/ ]);