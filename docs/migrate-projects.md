# Migrating projects

As of wjs-cli@1.0.0 support for javascript entry points was dropped with html files being the lingua-franca of the tool. To migrate your app simply create a file called `index.html` in your app root e.g `app` directory and copy this code into it.

```html
<html>
    <head>
        <script src="./app.js" type="text/javascript"/>
    </head>
    <body>

    </body>
</html>
```

But then again you could install an older version of wjs-cli and make an npm script to run it on your project.

First run `npm i wjs-cli@0.1.5 -D` and add this line line to your package.json scripts section `"dev":"wjs development"` making it possible to continue your development by running `npm run dev` , this way you can still finish your project before upgrading to wjs-cli@1.0.0