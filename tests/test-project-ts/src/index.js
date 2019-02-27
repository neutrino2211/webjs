"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("../webjs_modules/app");
var App = /** @class */ (function () {
    function App(root) {
        root.innerHTML = "<h1>Hello World</h1>";
    }
    App.prototype.onTemplateLoad = function () {
        console.log("Done");
    };
    return App;
}());
app.load(document.getElementById("ts-main"), App);
//# sourceMappingURL=index.js.map