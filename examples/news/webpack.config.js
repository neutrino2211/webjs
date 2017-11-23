module.exports = {
        entry: './app/app.js',
        output: {
            filename: 'index.js',
            path:     __dirname+'/www/js'
        },
        resolve:{
            alias:{
                wjs: __dirname+"/webjs_modules",
                core: __dirname+"/webjs_modules/web.js",
                pages: __dirname+"/app/pages"
            }
        }
    }