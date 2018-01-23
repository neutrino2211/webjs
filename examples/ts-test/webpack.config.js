module.exports = {
entry: './app/app.ts',
output: {
    filename: 'index.js',
    path:     __dirname+'/www/js'
},

module: {
    rules:[
        {
            test: /.ts?$/,
            use: "ts-loader"
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
        