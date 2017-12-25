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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export body */
/* unused harmony export styleSheet */
/* harmony export (immutable) */ __webpack_exports__["c"] = build;
/* unused harmony export use */
/* unused harmony export print */
/* unused harmony export entry */
const modules = {};
/* harmony export (immutable) */ __webpack_exports__["d"] = modules;

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

class WEBJS{
    /**
     * @property {HTMLElement} element
     * @param {Object} options 
     */
    constructor(options){
        this.isRendering = false;
        var element = options.element;
        var data    = options.data;

        var $el     = options.el;

        $el.WJSNamespace = {};

        var $ns = $el.WJSNamespace;

        $ns.data = data;

        // var $elA = $el.getAttribute;

        // console.log($el.getAttribute("wjs-for"))

        var c = this;

        Object.defineProperty($el,"innerText",{
            set: function(v){
                // console.log(v);
                this.innerHTML = v;
            },
            get: function(){
                return this.innerHTML;
            }
        })

        if($el.getAttribute("wjs-for")){
            var item = $el.getAttribute("wjs-for").split("in")[0].trim();
            var items = $el.getAttribute("wjs-for").split("in")[1].trim();

            // console.log($ns.data[items])

            if($ns.data[items]){
                this.$render($el,$ns,$ns.data[items],"fl");
            }
        }
    }

    /**
     * 
     * @param {HTMLElement} el 
     */

    $render(el,namespace,d,o){
        this.isRendering = true;
        // console.log(el.innerHTML);
        var rxp = /{{([^}]+)}}/g;
        var ins = el.innerText;
        var iterable = el.innerHTML.match(rxp);
        // var t = el.cloneNode(true);

        console.log(iterable);

        if(o == "fl"){
            var div = document.createElement("div");
            document.body.appendChild(div);
            d.forEach((v,j)=>{
                
                var c = el.cloneNode(true);

                if(j==0){
                    var inside = ins;
                    iterable.forEach((t,i)=>{
                        t = t.slice(2,-2);
                        var list  = t.split(".");
                        // console.log(list);
                        var modules ;
                        if(list.length > 0){
                            modules = d[j][list[1]];
                        }else{
                            modules = d[j][list[0]]
                        }
                        for(var k = 2;k<list.length;k++){
                            modules = modules[list[k]];
                        }

                        if(!modules){
                            modules = v;
                        }

                        inside = inside.replace(iterable[i],modules);
                        console.log(modules,t,inside)
                    })
                    el.innerText = inside;
                    div.appendChild(el)
                }else{
                    var inside = ins;
                    iterable.forEach((t,i)=>{
                        t = t.slice(2,-2);
                        var list  = t.split(".");
                        // console.log(list);
                        var modules ;
                        if(list.length > 0){
                            modules = d[j][list[1]];
                        }else{
                            modules = d[j][list[0]]
                        }
                        for(var k = 2;k<list.length;k++){
                            modules = modules[list[k]];
                        }

                        if(!modules){
                            modules = v;
                        }

                        // console.log(d[j])
                        inside = inside.replace("{{"+t+"}}",modules);
                    })
                    c.innerText = inside;
                    // console.log(c);
                    div.appendChild(c)
                    // document.body.appendChild(c);
                }
            })
        }
        this.isRendering = false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = WEBJS;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = load;
/* unused harmony export title */
/* unused harmony export events */
/* unused harmony export parseHTML */
/* unused harmony export createPageRoot */
/* harmony export (immutable) */ __webpack_exports__["a"] = JSX;
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
        Object(__WEBPACK_IMPORTED_MODULE_0_core__["c" /* build */])(path);
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
    var self = {};
    self.connect = function(addr) {
        if (!addr) {
            throw new URIError('Address cannot be null');
        }
        var socket = new WebSocket(`${(addr.startsWith('ws://'))?addr:'ws://'+addr}`, proto);
        self = socket;
        socket.on = self.on;
        socket.emit = self.emit;
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
            self.dispatchEvent(event);
        }
        socket.on = function(str, cb) {
            f(str,cb);
        }
        return socket;
    }
    return self;
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
    var properties = Object.getOwnPropertyNames(__WEBPACK_IMPORTED_MODULE_0_core__["d" /* modules */][m]);
    properties.forEach(function(p) {
        window[p] = __WEBPACK_IMPORTED_MODULE_0_core__["d" /* modules */][m][p];
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
    document.body.onload = ()=>{
        p.onViewLoad();
    }
}

class HTMLModule{
    constructor(document){
        /*Do stuff*/
    }
}
/* unused harmony export HTMLModule */


class TemplateApplication{
    constructor(){
        console.log("Ready")
        document.addEventListener("__INIT__",()=>{
            this.onViewLoad();
        },this);
    }

    main(){
        Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])("body").append(this.template)
        document.dispatchEvent(new Event("__INIT__"))
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
/* harmony export (immutable) */ __webpack_exports__["b"] = TemplateApplicationPage;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__webjs_modules_app__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__webjs_modules_web__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__HomePage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__webjs_modules_definitions__ = __webpack_require__(2);





class LoginPage extends __WEBPACK_IMPORTED_MODULE_3__webjs_modules_definitions__["b" /* TemplateApplicationPage */]{
    /**
     * 
     * @param {HTMLElement} element 
     */

    constructor(element){
        super(element);

        document.getElementById("Title").innerText = "Login";

        element.appendChild(__WEBPACK_IMPORTED_MODULE_0__webjs_modules_app__["a" /* JSX */](()=>{
            return `
                <input style="margin-top:${(innerHeight/2)+"px"};" placeholder="Login Name" id="in"><input/>
            `;
        }))

        var input = document.getElementById("in");

        document.onkeydown = (ev)=>{
            // console.log(ev)
            if(ev.key == "Enter"){
                var ln = Object(__WEBPACK_IMPORTED_MODULE_1__webjs_modules_web__["a" /* $ */])(input).val();
                window.User = ln;
                this.login(element)
            }
        }

    }

    login(e){
        if(window.User.trim() == ""){
            alert("Enter name")
        }else{
            new __WEBPACK_IMPORTED_MODULE_2__HomePage__["a" /* HomePage */](e);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = LoginPage;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["d"] = icons;
/* harmony export (immutable) */ __webpack_exports__["b"] = createElementClass;
/* harmony export (immutable) */ __webpack_exports__["e"] = setElementClass;
/* unused harmony export introduceElement */
/* harmony export (immutable) */ __webpack_exports__["c"] = floatingActionButton;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return ui; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return colors; });
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
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_wjs_app__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_wjs_definitions__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_pages_login__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_test_testpage__ = __webpack_require__(7);






//Declare imports here.

class Application extends __WEBPACK_IMPORTED_MODULE_2_wjs_definitions__["a" /* TemplateApplication */]{
    constructor(){
        super()
        // document.body.className = "lighten-3"
        this.template = `
        <html>
        <body>
            <nav class="blue" id="nav" style="position: fixed;margin-top=-5px; z-index:999;"><p style="font-family:monospace;font-size:20px;" class="text center" id="Title">Chat</p></nav>
            <!--<div style="width:50%;height:50%;background-color:red;" class="card" id="slideout"></div>-->
            <div id="root" style="padding:1em;"></div>
        </body>
        </html>
        `
    }

    onViewLoad(){
        var root = document.getElementById("root");
        new __WEBPACK_IMPORTED_MODULE_3_pages_login__["a" /* LoginPage */](root);
        // WJSModule({
        //     controller: TestPage,
        //     template: "/pages/test/testpage.html",
        //     styleSheets: ["/pages/test/testpage.css"]
        // });
    }
}

__WEBPACK_IMPORTED_MODULE_1_wjs_app__["b" /* load */](Application);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_wjs_definitions__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_wjs_app__ = __webpack_require__(1);

// import {actionButton} from "wjs/ui"





class HomePage extends __WEBPACK_IMPORTED_MODULE_0_wjs_definitions__["b" /* TemplateApplicationPage */]{
    /**
     * 
     * @param {HTMLElement} element 
     */
    constructor(element){
        super(element)
        String.prototype.__funky = function(){alert(this)};

        document.getElementById("nav").appendChild(__WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__["d" /* icons */].user);

        window.messages = 1;

        document.getElementById("Title").innerText = "Chat";

        __WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__["b" /* createElementClass */]("large_icons",{
            "font-size": "100%"
        })

        __WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__["b" /* createElementClass */]("avatar-large",{
            "border-radius": "50%",
            "background-color": "blue",
            "font-size": "40px",
            "color": "white",
            "width": "60px"
        })

        __WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__["b" /* createElementClass */]("avatar-text",{
            "text-align": "center"
        })

        __WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__["b" /* createElementClass */]("disabled",{
            color: "rgba(255, 255, 255, 0.3)"            
        })

        var myIcon = __WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__["e" /* setElementClass */](__WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__["d" /* icons */].add,"large_icons")

        var floatingActionButton = __WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__["c" /* floatingActionButton */]({
            color: "blue waves-effect",
            icon: myIcon,
            size: ""
        });

        var slide = document.getElementById("slideout");

        floatingActionButton.id = "fab";
        this.color = __WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__["a" /* colors */].random();
        console.log(__WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__["f" /* ui */].row());

        floatingActionButton.onclick = ()=>{
            if(floatingActionButton.style.display != "none"){
                floatingActionButton.style.display = "none";
                element.appendChild(__WEBPACK_IMPORTED_MODULE_4_wjs_app__["a" /* JSX */](()=>{
                    return `
                        <div class="navbar navbar-fixed-bottom card" id="text">
                            <input type="text" id="message" style="width:80%;margin-left:10%;"></input>
                            <!--<div class="btn" style="width:10%;margin-top:-5%;margin-left:85%;" id="send_button"><i class="material-icons">send</i></div>-->
                        </div>
                    `
                }))
                window.location.hash = "#message";
                document.onkeydown = (ev)=>{
                    if(ev.key == "Enter"){
                        var v = Object(__WEBPACK_IMPORTED_MODULE_3_core__["a" /* $ */])("#message").val()
                        Object(__WEBPACK_IMPORTED_MODULE_3_core__["a" /* $ */])("#message").focus()
                        floatingActionButton.style.display = "initial";
                        document.getElementById("text").remove()
                        if (v.trim() != ""){
                            var m = this.postMessage(v)
                            element.appendChild(m)
                            // $(m).focus()
                            // $("#message").focus();
                            // document.getElementById("message").click()
                            window.location.hash = "#message"+window.messages;
                            window.messages += 1;

                            var mm = document.getElementById("message1");

                            mm.style.marginTop = "60px";
                        }else{
                            window.location.hash = "#message"+window.messages;
                        }
                    }
                }
            } 
        }

        element.appendChild(floatingActionButton)
        // material.introduceElement(floatingActionButton,element);
    }

    postMessage(text){
        __WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__["b" /* createElementClass */]("avatar-normal",{
            "border-radius": "50%",
            "background-color": this.color,
            "font-size": "30px",
            "margin": "10px",
            "color": "white",
            "width": "40px",
            "height": "40px"
            // "padding": "15px" 
        })

        var card = __WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__["f" /* ui */].card();
        card.id = "message"+window.messages;
        var avatar = document.createElement("div");
        var avatarText = document.createElement("p");
        avatarText.innerText = window.User[0].toUpperCase();
        var t = __WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__["e" /* setElementClass */](avatarText,"avatar-text");
        avatar.appendChild(t);

        var name = document.createElement("p");
        name.innerText = "@"+window.User;
        name.style.fontFamily = "monospace";
        name.style.marginRight = "10%";
        name.style.color = __WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__["a" /* colors */].blueAccent;

        // element.appendChild(material.setElementClass(avatar,"avatar-normal"))
        var av = __WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__["e" /* setElementClass */](avatar,"avatar-normal");
        // av.style.paddingRight = "20px";
        // name.style.paddingLeft = "20px"
        __WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__["b" /* createElementClass */]("chat-message",{
            "font-family": "Consolas,monospace",
            "margin": "10px",
            "width": card.style.width
        })
        var uiRow = __WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__["f" /* ui */].row([av,name])
        uiRow.style.width = card.style.width;
        var message = document.createElement("div");
        message.innerText = text;
        message.className = "text";
        __WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__["e" /* setElementClass */](message,"chat-message")
        card.appendChild(uiRow);
        card.appendChild(__WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__["f" /* ui */].divider())
        card.appendChild(message);

        // console.log(card);
        return card;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = HomePage;
 

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__webjs_modules_web__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__webjs_modules_material__ = __webpack_require__(4);



class TestPage{
    /**
     * 
     * @param {HTMLDocument} document 
     */
    constructor(document){
        this.document = document;
    }

    onViewLoad(){
        // this.document.getElementById("article").innerText = "View did load";

        var todos = this.document.getElementById("todos");

        todos.className = "card";

        var w = new __WEBPACK_IMPORTED_MODULE_0__webjs_modules_web__["b" /* WEBJS */]({
            el: this.document.getElementById("article"),
            data: {
                items: [{
                    value: "hello",
                    property: "text",
                    deeper:{
                        inside: "coolest"
                    }
                },{
                    value: "tests",
                    property: "text",
                    deeper:{
                        inside: "cooler"
                    }
                },{
                    value: "again",
                    property: "text",
                    deeper:{
                        inside: "cool"
                    }
                }]
            }
        })

        var todo = new __WEBPACK_IMPORTED_MODULE_0__webjs_modules_web__["b" /* WEBJS */]({
            el: todos,
            data: {
                todos: ["clean the house","read PHY 123","read some more"]
            }
        })
    }
}
/* unused harmony export TestPage */


/***/ })
/******/ ]);