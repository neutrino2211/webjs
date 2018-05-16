require=function(r,e,n){function t(n,o){function i(r){return t(i.resolve(r))}function f(e){return r[n][1][e]||e}if(!e[n]){if(!r[n]){var c="function"==typeof require&&require;if(!o&&c)return c(n,!0);if(u)return u(n,!0);var l=new Error("Cannot find module '"+n+"'");throw l.code="MODULE_NOT_FOUND",l}i.resolve=f;var a=e[n]=new t.Module;r[n][0].call(a.exports,i,a,a.exports)}return e[n].exports}function o(){this.bundle=t,this.exports={}}var u="function"==typeof require&&require;t.Module=o,t.modules=r,t.cache=e,t.parent=u;for(var i=0;i<n.length;i++)t(n[i]);return t}({5:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.styleSheet=s,exports.build=n,exports.use=r,exports.print=p,exports.entry=c;const e=exports.modules={},t=exports.$=window.$;var o=exports.body=document.body;function s(e){t("head").append("<link rel='stylesheet' type='text/css' href="+e+">")}function n(e){t("head").append("<script src='"+e+".js'><\/script>")}function r(t){return n("WTS/"+t),e[t]}function p(...e){document.write(...e)}function c(e){var t=new e;t.main(),console.log(t)}
},{}],3:[function(require,module,exports) {

"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.events=void 0,exports.load=i,exports.title=a,exports.parseHTML=s,exports.createPageRoot=d,exports.JSX=l,exports.stream=p,exports.add=u,exports.jQ=m,exports.socket=f,exports.layout=h,exports.openPage=v,exports.loadJSX=y,exports.globalModule=w,exports.append=E;var e,t,n,o=require("./web"),r=["nav","input","video","image","form","audio"];function i(e){(new e).onViewLoad()}function a(e){var t=document.createElement("title");t.innerText=e,document.head.appendChild(t)}(void 0).elements=r,(void 0).bodyElement,(void 0).layout=document,(void 0).loadBackend=function(t){"object"==typeof e?(0,o.build)(t):console.log("Environment does not support backend")};var c=exports.events={bind:function(e){if(!e)throw new TypeError('Element supplied cannot be of type "null"');return e.on=function(t,n){if(!t)throw new TypeError('Argument supplied cannot be of type "null"');e.addEventListener(t,n)},e.emit=function(t){if(!t)throw new TypeError('Argument supplied cannot be of type "null"');var n=new Event(t);e.dispatchEvent(n)},e},strip:function(e){if(!e)throw new TypeError('Element supplied cannot be of type "null"');return e.on=void 0,e.emit=void 0,e}};function s(e){return(new DOMParser).parseFromString(e,"text/html")}function d(){var e=document.createElement("iframe");e.style.overflow="hidden",e.style.height=window.innerHeight-10+"px",e.style.width="100%",e.style.paddingTop=window.innerHeight/10+"px",(0,o.$)(n).append(e),t=e}function l(e,...t){if("function"!=typeof e)throw new TypeError("Argument must be a JSX function");var n=e(...t);if(n){for(var o=document.createElement("div"),r=s(n).body.children,i=0;i<r.length;i++)o.appendChild(r[i]);return o}}function p(e){var t={};if("object"!=typeof e||void 0==e[0])throw new TypeError("Argument must be an array");return t.pipe=function(t){e.forEach(function(e){t(e)})},t}function u(e){if("string"==typeof e)return function(e){var t=e.trim().toLowerCase();if("nav"==t){var n=document.createElement("nav");return n.className="nav",n.style.height="7%",n.style.color="blue",document.body.appendChild(n),n}if("input"==t){var o=document.createElement("input");return o.className="form-control",o.autocomplete="true",o.spellcheck=!0,document.body.appendChild(o),o}if("video"==t){var r=document.createElement("video");return r.style.width="55%",r.style.height="30%",r.controls=!0,document.body.appendChild(r),r}if("image"==t){var i=document.createElement("img");return i.alt="WJS image",document.body.appendChild(i),i}if("form"==t){var a=document.createElement("form");return a.action="POST",a.inputs=[],a.addInput=function(e){a.appendChild(e),a.inputs.push(e)},a.rules=function(e){if("object"!=typeof e)throw new TypeError("Argument must be a valid js object");a.inputs.forEach(function(t){t.spellcheck=e.spellcheck,t.maxLength=e.maxLength,t.minLength=e.minLength,t.autocomplete=e.autocomplete,t.autofocus=e.autofocus,t.required=e.required})},document.body.appendChild(a),a}if("audio"==t){var c=document.createElement("audio");return c.autoplay=!0,c.controls=!0,document.body.appendChild(c),c}if("stylesheet"==t){var s=document.createElement("link");return document.head.appendChild(s),s}throw new Error(`${t} is not a valid app object`)}(e);throw new Error("Argument must be of type string .")}function m(e){return(0,o.$)(e)}function f(e){e||console.warn("No protocol supplied for websocket instance");var t={};return this.connect=function(n){if(!n)throw new URIError("Address cannot be null");t=new WebSocket(`${n.startsWith("ws://")?n:"ws://"+n}`,e)},this.close=t.close,this.state=t.readyState,this.emit=function(e){var n=new Event(e);t.dispatchEvent(n)},this.on=function(e,n){if("string"!=typeof e)throw new TypeError("Argument is not a string");var o,r;o=n,"message"==(r=e.trim().toLowerCase())?t.onmessage=o:"connection"==r?t.onopen=o:"close"==r?t.onclose=o:"error"==r?t.onerror=o:t.addEventListener(r,o)},this}function h(e){n=e}function v(e){var n=document.createElement("div");n.className="cssload-container";var o=document.createElement("div");o.className="cssload-whirlpool",n.appendChild(o),n.style.zIndex="999",document.body.appendChild(n);var r=e.template.split(".html")[0];t.src="pages/"+r+"/"+e.template;var i=document.createElement("script");i.src="../../js/materialize.js";var a=document.createElement("script");a.src="../../js/bootstrap.js";var c=document.createElement("script");c.src="../../js/jquery-3.1.1.min.js";var s=document.createElement("script");s.src="../../js/jQuery-color.js";var d=document.createElement("link");d.href="../../css/materialize.min.css",d.rel="stylesheet";var l=document.createElement("link");l.href="../../css/bootstrap.min.css",l.rel="stylesheet";var p=document.createElement("link");p.href="../../css/font-awesome.css",p.rel="stylesheet",setTimeout(()=>{var o=t.contentWindow.document.body;o.appendChild(c),o.appendChild(i),o.appendChild(a),o.appendChild(s),o.appendChild(d),o.appendChild(l),o.appendChild(p);new e.engine(t.contentWindow);n.remove()},1e3)}function y(e){(0,o.$)(n).append(e)}function w(e){Object.getOwnPropertyNames(o.modules[e]).forEach(function(t){window[t]=o.modules[e][t]})}function E(e){(0,o.$)(n).append(e)}
},{"./web":5}],4:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.TemplateApplicationPage=exports.TemplateApplication=void 0,exports.WJSModule=t;var e=require("./web");function t(t){(0,e.$)(document.body).load(t.template.startsWith("/")?t.template:"/"+t.template);var o=new t.controller(document);(t.styleSheets?t.styleSheets:[]).forEach(function(e){var t=document.createElement("link");t.rel="stylesheet",t.href=e,document.head.appendChild(t)},this),(0,e.$)(document.body).ready(function(){o.onViewLoad()})}class o{constructor(){console.log("Ready"),document.addEventListener("__INIT__",()=>{this.onTemplateLoad()})}onViewLoad(){(0,e.$)("body").append(this.template),document.dispatchEvent(new Event("__INIT__"))}}exports.TemplateApplication=o;class n{constructor(e){this.element=e,window.openPage&&window.openPage.close(),window.openPage=this,console.log("page created")}close(){this.isClosed=!0,this.element.innerHTML=""}}exports.TemplateApplicationPage=n;
},{"./web":5}],2:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.colors=exports.ui=void 0,exports.icons=t,exports.createElementClass=r,exports.setElementClass=a,exports.introduceElement=o,exports.floatingActionButton=i;var e=require("./web.js");function t(e){var t=document.createElement("i");return t.innerText=e,t.className="material-icons",t.style.height="100%",t}var n={};function r(e,t){n[e]=t}function a(e,t){var r=n[t];return Object.getOwnPropertyNames(r).forEach(t=>{e.style[t]=r[t]}),e}function o(t,n){var r=t.style.height,a=t.style.width;t.style.width="0px",t.style.height="0px",n?n.appendChild(t):document.body.appendChild(t),(0,e.$)(t).animate({height:r,width:a},400)}function i(e){var t=document.createElement("div");t.className=`fixed-action-btn ${e.position?e.position:"right"} ${e.type||""}`;var n=document.createElement("a");n.className=`btn-floating btn-${e.size} ${e.color}`;var r=e.icon||document.createElement("i"),a=document.createElement("ul");return t.appendChild(n),n.appendChild(r),e.fab?(e.fab.forEach(function(e){var t=document.createElement("li");t.className="waves-effect",t.appendChild(e),a.appendChild(t)}),t.appendChild(a),t):t}var c=exports.ui={card:function(){var e=document.createElement("div");return e.className="card",e},row:function(e){var t=document.createElement("div");return e||(e=[]),e.forEach(e=>{e.style.display="inline-block",t.appendChild(e)}),t}},l=exports.colors={red:"#f44336",blue:"#2196F3",pink:"#E91E63",cyan:"#00BCD4",teal:"#009688",lime:"#CDDC39",brown:"#795548",amber:"#FFC107",green:"#4CAF50",orange:"#FF9800",yellow:"#FFEB3B",indigo:"#3F51B5",violet:"#673AB7",purple:"#9C27B0",warning:"#FF5722",blueAccent:"#03A9F4",greenAccent:"#8BC34A",random:function(){var e=Object.getOwnPropertyNames(l).length,t=[];Object.getOwnPropertyNames(l).forEach((e,n)=>{t[n]=e});var n=Math.round(Math.random()*(e-1));return console.log(l[t[n]]),l[t[n]]||l.red}};
},{"./web.js":5}],7:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Reflex=void 0;var e=require("../webjs_modules/app.js"),t=require("../webjs_modules/web.js");class r{constructor(e){this.__html=e,this.__parse=""}render(t,r){this.__tag=t;var o=this,i=document.getElementsByTagName(t),s=this.__html.match(/{{([^}]+)}}/g);s=s||[];for(var _=0;_<i.length;_++){s.forEach(function(e,t){var r=e.slice(2,-2).trim();o.__parse=0==t?o.__html.replace(e,i[_].getAttribute("@"+r)):o.__parse.replace(e,i[_].getAttribute("@"+r))});var a=(0,e.parseHTML)(""!=o.__parse?o.__parse:o.__html).body.children;console.log();for(var d=0;d<a.length;d++){for(var l=a[d].attributes,c=0;c<l.length;c++)"null"==l[c].nodeValue&&a[d].removeAttribute(l[c].name);i[_].appendChild(a[d])}if(i[_].getAttribute("@href")){var h=i[_];i[_].onclick=function(){new n(h.getAttribute("@href")).render(window.__renderers)}}else if(i[_].getAttribute("@href-to")){h=i[_];i[_].onclick=function(){new n(h.getAttribute("@href-to")).renderTo(document.getElementById(h.getAttribute("@target")),window.__renderers)}}r&&r(i[_].children)}}}class n{constructor(e){this.__page=e,"undefined"!=typeof native&&(this.__page=e.startsWith("./")||e.startsWith("/")?"file:///android_asset/"+e.split("/").slice(1).join(""):"file:///android_assets/"+e),this.__component_tag_list=[],this.__component_list=[]}addComponentRenderer(e,t){this.__component_tag_list.push(t),this.__component_list.push(e)}render(...e){window.__renderers=e,Array.isArray(e[0])&&(e=e[0],window.__renderers=e),t.$.get(this.__page,function(t){document.body.innerHTML=t,e.forEach(function(e){e.component.render(e.tag,e.onRender)})})}renderTo(e,...r){window.__renderers=r,console.log(r),Array.isArray(r[0])&&(r=r[0]),t.$.get(this.__page,function(t){e.innerHTML=t,r.forEach(function(e){e.component.render(e.tag)})})}}var o=exports.Reflex={Component:r,HTMLRenderer:n};
},{"../webjs_modules/app.js":3,"../webjs_modules/web.js":5}],6:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.TransitioningFloatingActionButton=exports.FloatingActionButton=exports.Header=exports.InfoCard=exports.Skill=exports.Test=exports.LargeDiv=exports.Footer=exports.Input=exports.Nav=exports.Button1=exports.Button2=exports.Button3=exports.Divider=void 0;var t=require("./reflex.module"),e=require("../webjs_modules/material"),n=exports.Divider=new t.Reflex.Component('\n<div class="divider"></div>\n'),i=exports.Button3=new t.Reflex.Component('\n<button class="btn {{color}} {{class}}" style="color:white;margin-top:10px;margin-left:8%;width:22%;display:inline-block;">{{name}}</button>\n'),o=exports.Button2=new t.Reflex.Component('\n<button class="btn {{color}} {{class}}" style="color:white;margin-top:10px;margin-left:9.5%;width:35%;display:inline-block;">{{name}}</button>\n'),s=exports.Button1=new t.Reflex.Component('\n<button class="btn {{color}} {{class}}" style="color:white;margin-top:10px;margin-left:20%;width:60%;display:inline-block;">{{name}}</button>\n'),a=exports.Nav=new t.Reflex.Component('\n    <nav class="{{color}}"style="text-align:center;"><p class"text center {{text-color}}" style="font-family:monospace;font-size:27px;">{{title}}</p></nav>\n'),l=exports.Input=new t.Reflex.Component('\n    <input placeholder="{{placeholder}}" type="{{type}}" id="{{id}}" style="{{style}};width:90%;margin-left:5%;"></input>\n'),r=exports.Footer=new t.Reflex.Component('\n    <footer class="page-footer accent-color">\n        <div class="container">\n            <div class="row">\n                <div class="col l6 s12">\n                    <h5 class="white-text">About me</h5>\n                    <p class="grey-text text-lighten-4">\n                        I am a Cyber Security student at Federal University of Technology,Minna (Nigeria)<br/>\n                        i deal mostly with network systems like servers and sockets using (nodejs , python , golang)\n                    </p>\n                </div>\n                <div class="col l4 offset-l2 s12">\n                    <h5 class="white-text">Social</h5>\n                    <ul>\n                        <li><a class="grey-text text-lighten-3" target="blank_" href="https://www.instagram.com/neutrino2211_/"><i class="fa fa-instagram" style="padding:5px;"></i>Instagram</a></li>\n                        <li><a class="grey-text text-lighten-3" target="blank_" href="https://twitter.com/wjsCli_official"><i class="fa fa-twitter" style="padding:5px;"></i>Twitter (wjs)</a></li>\n                        <li><a class="grey-text text-lighten-3" target="blank_" href="https://twitter.com/neutrino2211"><i class="fa fa-twitter" style="padding:5px;"></i>Twitter (personal)</a></li>\n                        <li><a class="grey-text text-lighten-3" target="blank_" href="https://www.facebook.com/tsowa.mainasara"><i class="fa fa-facebook" style="padding:5px;"></i>Facebook</a></li>\n                    </ul>\n                </div>\n                <div>Lacerta icon made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>\n            </div>\n        </div>\n        <div class="footer-copyright">\n            <div class="container">\n                &copy; 2018\n            </div>\n        </div>\n    </footer>\n'),c=exports.LargeDiv=new t.Reflex.Component('\n    <div style="width:100%;height:100%;background-color:{{color}}">\n        <img  class="circle" src="{{img-src}}" alt="Image" style="width:100px"></img>\n    </div>\n'),p=exports.Test=new t.Reflex.Component('\n    <div class="default-primary-color"style="width:100%;height:100%;text-align:center;">\n        <img src="{{src}}" width="180px" alt="Image" style="margin-top:19%;" class="circle app-hover-emphasis"></img>\n        <p class="text-primary-color scale-transition scale-out header" id="my-name" style="font-size:25px">{{text}}</p>\n    </div>\n'),d=exports.Skill=new t.Reflex.Component('\n    <div class="progress" style="width:50%;margin-left:25%;color:#ffffff;">\n        <div class="determinate" style="width: {{level}}"><p style="text-align:center;">{{name}}</p></div>\n    </div>\n'),x=exports.InfoCard=new t.Reflex.Component('\n<div class="col s12 m6" style="text-align:center;">\n<img src="{{src}}" alt="{{title}}"></img>\n<div class="card divider-color darken-1">\n  <div class="card-content" style="color:#0097A7;">\n    <span class="card-title">{{title}}</span>\n    <p>{{description}}</p>\n  </div>\n  <div class="card-action">\n    <a href="{{link}}" target="_blank">{{text}}</a>\n  </div>\n</div>\n</div>\n'),m=exports.Header=new t.Reflex.Component('\n    <h2 class="text header center" id="header" style="color:#00796B;">{{text}}</h2>\n'),f=exports.FloatingActionButton=new t.Reflex.Component('\n    <div class="fixed-action-btn {{position}} {{type}}"><a class="btn-floating btn-{{size}} {{color}}"><i class="material-icons">{{icon}}</i></a></div>\n'),g=exports.TransitioningFloatingActionButton=new t.Reflex.Component('\n<div class="fixed-action-btn scale-transition scale-out {{type}}"><a class="btn-floating btn-{{size}} {{position}} {{color}}"><i class="material-icons" style="color:#0097A7;">{{icon}}</i></a></div>\n');
},{"./reflex.module":7,"../webjs_modules/material":2}],8:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("../reflex.component"),t=r(e),o=require("../../webjs_modules/definitions");function r(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t.default=e,t}class n{constructor(e){console.log("Ready"),this.doc=e}onViewLoad(){alert("Loaded"),t.FloatingActionButton.render("app-fab",this.doc),t.Button3.render("app-button-3",this.doc),t.Input.render("app-input",this.doc),t.Nav.render("app-nav",this.doc)}}exports.default=n;
},{"../reflex.component":6,"../../webjs_modules/definitions":4}],1:[function(require,module,exports) {
"use strict";var e=require("../webjs_modules/web"),o=require("../webjs_modules/app"),n=u(o),t=require("../webjs_modules/definitions"),r=require("../webjs_modules/material"),a=u(r),l=require("./pages/app.controller"),i=p(l),s=require("./reflex.module"),d=require("./reflex.component"),c=u(d);function p(e){return e&&e.__esModule?e:{default:e}}function u(e){if(e&&e.__esModule)return e;var o={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(o[n]=e[n]);return o.default=e,o}class f{constructor(){this.myCustomTag=new s.Reflex.Component('\n            <div class="blue card">\n                <p>Hello</p>\n            </div>\n        ')}onViewLoad(){function o(o,n){var t=(0,e.$)(o);(0,e.$)({deg:0}).animate({deg:n},{duration:200,step:function(e){t.css({transform:"rotate("+e+"deg)"})}})}n.title("Tsowa Mainasara Al-amin"),document.body.style.overflowX="hidden",(0,e.$)("head").append("<link rel='stylesheet' href='pages/page.css'/>"),new s.Reflex.HTMLRenderer("./pages/app.reflex.html").render({component:c.Footer,tag:"app-footer"},{component:c.Skill,tag:"skill",onRender(o){var n=!0,t=o[0].children[0].style.width;o[0].children[0].style.width="0%",(0,e.$)(window).scroll(function(){(0,e.$)(window).scrollTop()+innerHeight>(0,e.$)(o[0]).offset().top&&n&&((0,e.$)(o[0].children[0]).animate({width:t},400),n=!1)})}},{component:c.TransitioningFloatingActionButton,tag:"app-transitioning-fab",onRender(n){var t=0;(0,e.$)(window).scroll(function(r){var a=(0,e.$)(window).scrollTop();a<(0,e.$)("#my-name").offset().top&&0!=t?(o(n[0],0),t=0):a>(0,e.$)("#my-name").offset().top&&180!=t&&(o(n[0],180),t=180)}),(0,e.$)(n[0]).click(function(){return t=180==t?0:180,o(n[0],t),0!=t?(0,e.$)("html,body").animate({scrollTop:(0,e.$)("#header").offset().top},"slow"):(0,e.$)("html,body").animate({scrollTop:0},"slow"),!1}),setTimeout(function(){(0,e.$)(n[0]).removeClass("scale-out")},500)}},{component:c.Test,tag:"app-large-div",onRender(o){setTimeout(function(){(0,e.$)(o[0].children[1]).removeClass("scale-out").addClass("scale-in")},500)}},{component:c.Header,tag:"app-header"},{component:c.InfoCard,tag:"app-card"})}}n.load(f);
},{"../webjs_modules/web":5,"../webjs_modules/app":3,"../webjs_modules/definitions":4,"../webjs_modules/material":2,"./pages/app.controller":8,"./reflex.module":7,"./reflex.component":6}]},{},[1])