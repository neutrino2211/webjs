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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export body */
/* unused harmony export styleSheet */
/* unused harmony export build */
/* unused harmony export use */
/* unused harmony export print */
/* unused harmony export entry */
const modules = {};
/* unused harmony export modules */

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
/* unused harmony export parseHTML */
/* unused harmony export JSX */
/* unused harmony export stream */
/* unused harmony export socket */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__web__ = __webpack_require__(0);


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
            element.addEventListener(ev,cb);
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

function parseHTML(string) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(string, "text/html");
    return doc;
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


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_wjs_app__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__views_tick_tock__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_wjs_definitions__ = __webpack_require__(2);
//Declare imports here.





window.SPLASH = true;

class Application extends __WEBPACK_IMPORTED_MODULE_3_wjs_definitions__["a" /* TemplateApplication */] {
    constructor(){
        super();
        this.template = `
            <html>
            <head>
                <style type="text/css">
                    .splash {
                        height: 100vh;
                        width: 100%;
                    }
            
                    .logo {
                        font-size: 3em;
                    }
            
                    .logo i {
                        margin-top: 60%;
                        border: 2px solid white;
                        border-radius: 100%;
                        padding: 1em;
                    }
                </style>
            </head>
            <body>
            
            
                <div class="splash deep-orange">
                    
                    <div class="logo center">
                    
                        <i class="material-icons" id="logo" style="color:#eeeeee;">timer</i>
            
                    </div>
                </div>
            
            </body>
            </html>
        `;

    }
    
    //Your apps entry point
    onTemplateLoad(){
        if(window.SPLASH){
            var logo = document.getElementById("logo");
            console.log(logo)
            var si = setInterval(function(){
                if(window.SPLASH){
                    Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])(logo).animate({
                        borderColor : "#ff5722"
                    },1000,function(){
                        Object(__WEBPACK_IMPORTED_MODULE_0_core__["a" /* $ */])(logo).animate({
                            borderColor : "white"
                        },1000)
                    })
                }
            },2000)
    
            var st = setTimeout(function(){
                if(window.SPLASH){
                    document.body.innerHTML = "";
                    clearTimeout(st);
                    clearInterval(si)
                    window.SPLASH = false;
                    __WEBPACK_IMPORTED_MODULE_1_wjs_app__["a" /* load */](__WEBPACK_IMPORTED_MODULE_2__views_tick_tock__["a" /* TickTockHome */]);
                }
            },6000)
        }
    }
}

__WEBPACK_IMPORTED_MODULE_1_wjs_app__["a" /* load */](Application)
        

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_wjs_app__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_wjs_definitions__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_wjs_material__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__webjs_modules_web__ = __webpack_require__(0);
//Declare imports here.






class TickTockHome extends __WEBPACK_IMPORTED_MODULE_1_wjs_definitions__["a" /* TemplateApplication */]{
    constructor(){
        super();

        this.template = `
            <html>
            <head>
                <style type="text/css">
                    html, body {
                        overflow: hidden;
                    }
                    .splash {
                        height: 100vh;
                        width: 100%;
                        background: #ff5722;
                    }
            
                    .logo {
                        font-size: 3em;
                        margin-top: 4em;
                    }
                    .logo span {
                        margin-top: 20%;	
                        /*border: 2px solid #fff;*/
                        /*border-radius: 100%;*/
                        padding: 1em;
                    }
            
                    ul li {
                        margin-right: 1em;
                    }
                </style>
            </head>
            <body class="deep-orange">
                <div class="splash">
                    <ul>
                        <p class="white-text center" id="timer2" style="font-size:3em;font-family:monospace;margin-top:3%;">0:00</p>
                        <!-- <li class="white-text">Second Time: 00:00</li> -->
        
                    </ul>
                    
                    <div class="logo center">
                        <div>
                            <span class="white-text" id="timer1" style="font-family:monospace;">0:00</span>
                        </div>
                        
                    </div>
                    <nav class="transparent center" style="box-shadow: none; margin-top: 36%;">
                        <ul style="margin-left: 35%;">
                            <li><button class="btn-floating btn-large transparent btn-flat" id="reset"><i class="material-icons">replay</i></button></li>
                            <li><button class="btn-floating btn-large red"><i class="material-icons" id="start">play_arrow</i></button></li>
                        </ul>
                    </nav>
            
            
                </div>
            </body>
            </html>
        `;

        this.counting = "";
    }

    /**
     * 
     * @param {Number} time 
     */
    timify(time){
        var seconds = time;
        var minutes = Math.floor(seconds/60);
        if(seconds > 59 ){
            var multiple = Math.floor(seconds/60)
            var multipleSeconds = multiple*60
            seconds = seconds-multipleSeconds;
        }

        return minutes+":"+(seconds<10?"0"+seconds:seconds);
    }

    /**
     * 
     * @param {String} t 
     */
    timeFromString(t){
        var min = t.split(":")[0];
        var sec = t.split(":")[1];
        var minM = min=="0"?0:min;
        var secM = sec=="0"?0:sec;
        return (Number(min)*60)+(Number(sec));
    }

    stopCounting(e){
        clearInterval(e.EVENT);
    }

    /**
     * 
     * @param {HTMLElement} e 
     */
    count(e){
        var self = this;
        var i = this.timeFromString(e.innerText);
        console.log(i);
        // console.log(i);
        e.EVENT = setInterval(function(){
            i++;
            e.innerText = self.timify(i);
        },1000)
    }
    
    //Your apps entry point
    onTemplateLoad(){
        document.body.style.backgroundColor = "#ff5722";
        var self = this;
        var time1 = document.getElementById("timer1");
        var time2 = document.getElementById("timer2");
        var reset = document.getElementById("reset");
        var timeIcon1 = document.getElementById("start");

        this.T1 = time1;
        this.T2 = time2;

        reset.addEventListener("click",function(){
            if(self.counting === ""){

            }else if(self.counting === "t1"){
                clearTimeout(time1.EVENT)
            }else if(self.counting === "t2"){
                clearInterval(time2.EVENT);
            }

            self.counting = "";
            time1.innerText = "0:00";
            time2.innerText = "0:00";
        })

        timeIcon1.addEventListener("click",function(){
            // console.log(time2.EVENT);
            // console.log(time1.EVENT);
            if(self.counting === ""){
                self.count(time1);
                self.counting = "t1";
            }else if(self.counting === "t1"){
                self.counting = "t2";
                clearInterval(time1.EVENT);
                self.count(time2);;
            }else if(self.counting === "t2"){
                self.counting = "t1";
                clearInterval(time2.EVENT);
                self.count(time1);
            }
        },this)

        // document.body.appendChild(time1);
        // document.body.appendChild(time2);
        // document.body.appendChild(timeIcon1);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TickTockHome;


/***/ }),
/* 5 */
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

/***/ })
/******/ ]);