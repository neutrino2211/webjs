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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_wjs_app__ = __webpack_require__(2);


class Application {
    constructor() {
        __WEBPACK_IMPORTED_MODULE_0_core__["a" /* print */]("ready");
    }
    onViewLoad() {
        __WEBPACK_IMPORTED_MODULE_0_core__["a" /* print */]("main");
        native.toast("Hello");
    }
}
__WEBPACK_IMPORTED_MODULE_1_wjs_app__["a" /* load */](Application);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = print;
const $ = window.jQuery;
/* unused harmony export $ */

function print(...args) {
    document.write(...args);
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = load;
/* unused harmony export title */
/* unused harmony export events */
/* unused harmony export parseHTML */
/* unused harmony export JSX */
/* unused harmony export stream */
/* unused harmony export socket */
class WJSWebSocket extends WebSocket {
    constructor(addr, proto) {
        super(addr, proto);
    }
    f(s, callback) {
        var event = s.trim().toLowerCase();
        if (event == 'message') {
            this.onmessage = callback;
        }
        else if (event == 'connection') {
            this.onopen = callback;
        }
        else if (event == 'close') {
            this.onclose = callback;
        }
        else if (event == 'error') {
            this.onerror = callback;
        }
        else {
            this.addEventListener(event, callback);
        }
    }
    on(str, cb) {
        this.f(str, cb);
    }
    emit(eventName) {
        var event = new Event(eventName);
        this.dispatchEvent(event);
    }
}
function load(appClass) {
    var application = new appClass();
    application.onViewLoad();
}
function title(title) {
    var t = document.createElement("title");
    t.innerText = title;
    document.head.appendChild(t);
}
var events = {
    bind: function (element) {
        if (!element) {
            throw new TypeError('Element supplied cannot be of type "null"');
        }
        element.on = function (ev, cb) {
            if (!ev) {
                throw new TypeError('Argument supplied cannot be of type "null"');
            }
            element.addEventListener(ev, cb);
        };
        element.emit = function (ev) {
            if (!ev) {
                throw new TypeError('Argument supplied cannot be of type "null"');
            }
            var event = new Event(ev);
            element.dispatchEvent(event);
        };
        return element;
    },
    strip: function (element) {
        if (!element) {
            throw new TypeError('Element supplied cannot be of type "null"');
        }
        element.on = undefined;
        element.emit = undefined;
        return element;
    }
};
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
        var arr = parseHTML(r).body.children;
        for (var i = 0; i < arr.length; i++) {
            div.appendChild(arr[i]);
        }
        return div;
    }
}
function stream(arr) {
    var s = {};
    if (typeof arr == 'object' && arr[0] != undefined) {
        s.pipe = function (dest) {
            arr.forEach(function (val) {
                dest(val);
            });
        };
    }
    else {
        throw new TypeError('Argument must be an array');
    }
    return s;
}
function socket(proto) {
    if (!proto) {
        console.warn('No protocol supplied for websocket instance');
    }
    return {
        connect: function (address) {
            return new WJSWebSocket((address.startsWith('ws://')) ? address : 'ws://' + address, proto);
        }
    };
}


/***/ })
/******/ ]);