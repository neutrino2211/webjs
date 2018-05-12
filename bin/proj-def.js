var path = require("path");

module.exports = {
    typescript: {
        root: "app",
        entry:"app/app.ts",
        modulesPath: path.join(__dirname,"../resources","Typescript"),
        serverRoot: "www",
        appContents: `//Declare imports here.
import * as wjs from "core"
import * as app from "wjs/app"


class Application{
    constructor(){
        wjs.print("ready")
    }
    
    //Your apps entry point
    onViewLoad(){
        wjs.print("main")
    }
}

app.load(Application)`,
        config: `module.exports = {
entry: './app/app.ts',
output: {
    filename: 'index.js',
    path:     __dirname+'/www/js'
},

module: {
    rules:[
        {
            test: /\.ts?$/,
            use: "ts-loader"
        },
        {
            test: /\.svg?$/,
            use: "svg-inline-loader"
        }
    ]
},

resolve:{
    extensions:[".ts"],
    alias:{
        wjs: __dirname+"/webjs_modules",
        core: __dirname+"/webjs_modules/web.ts",
        pages: __dirname+"/app/pages"
    }
}
}
        `,
        defaultModules: ["app.ts","web.ts"]
    },

    angular: {
        root: "app",
        entry:"app/app.ts",
        modulesPath: path.join(__dirname,"../resources","Typescript"),
        serverRoot: "dist",
        appContents: `//Declare imports here.
import * as wjs from "core"
import * as app from "wjs/app"


class Application{
    constructor(){
        wjs.print("ready")
    }
    
    //Your apps entry point
    onViewLoad(){
        wjs.print("main")
    }
}

app.load(Application)`,
        config: `module.exports = {
entry: './app/app.ts',
output: {
    filename: 'index.js',
    path:     __dirname+'/www/js'
},

module: {
    rules:[
        {
            test: /\.ts?$/,
            use: "ts-loader"
        },
        {
            test: /\.svg?$/,
            use: "svg-inline-loader"
        }
    ]
},

resolve:{
    extensions:[".ts",".js"],
    alias:{
        wjs: __dirname+"/webjs_modules",
        core: __dirname+"/webjs_modules/web.ts",
        pages: __dirname+"/app/pages",
        rxjs: __dirname+"/node_modules/rxjs",
        "@angular": __dirname+"/webjs_modules/angular"
    }
}
}
        `,
        defaultModules: ["app.ts","web.ts"]
    },

    vue: {
        root: "src",
        entry:false,
        compileCommand: "webpack --config build/webpack.dev.conf.js",
        modulesPath: path.join(__dirname,"../resources","vue-modules"),
        config: false,
        serverRoot: "dist",
        defaultModules: ["app.js","definitions.js"]
    },

    react: {
        root: "src",
        entry: "src/index.html",
        compileCommand: false,
        modulesPath: path.join(__dirname,"../resources","vue-modules"),
        config: false,
        serverRoot: "dist",
        defaultModules: ["app.js","definitions.js"]
    },

    javascript: {
        root: "app",
        entry: "app/app.js",
        modulesPath: path.join(__dirname,"../resources","WTS"),
        serverRoot: "www",
        appContents: `//Declare imports here.
import * as wjs from "core"
import * as app from "wjs/app"


class Application{
    constructor(){
        wjs.print("ready")
    }
    
    //Your apps entry point
    onViewLoad(){
        wjs.print("main")
    }
}

app.load(Application)
        `,
        config: `module.exports = {
entry: './app/app.js',
output: {
    filename: 'index.js',
    path:     __dirname+'/www/js'
},

module: {
    rules: [
        {
            test: /\.svg?$/,
            use: "svg-inline-loader"
        }
    ]
},

resolve:{
    extensions:[".js"],
    alias:{
        wjs: __dirname+"/webjs_modules",
        core: __dirname+"/webjs_modules/web.js",
        pages: __dirname+"/app/pages"
    }
}
}
        `,
        defaultModules: ["material.js","app.js","definitions.js","web.js","device.js","ui.js"]
    },


}