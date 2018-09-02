var path = require("path");
module.exports = {
    typescript: {
        root: "src",
        entry: "src/index.html",
        modulesPath: path.join(__dirname, "../resources", "Typescript"),
        compileCommand: false,
        serverRoot: "dist",
        defaultModules: ["app.ts", "material.ts"]
    },
    angular: {
        root: "src",
        entry: "src/index.ts",
        modulesPath: path.join(__dirname, "../resources", "Typescript"),
        serverRoot: "dist",
        defaultModules: ["app.ts", "material.ts"]
    },
    vue: {
        root: "src",
        entry: "src/index.html",
        compileCommand: false,
        modulesPath: path.join(__dirname, "../resources", "vue-modules"),
        config: false,
        serverRoot: "dist",
        defaultModules: ["app.js"]
    },
    react: {
        root: "src",
        entry: "src/index.html",
        compileCommand: false,
        modulesPath: path.join(__dirname, "../resources", "vue-modules"),
        config: false,
        serverRoot: "dist",
        defaultModules: ["app.js"]
    },
    javascript: {
        root: "src",
        entry: "src/index.html",
        compileCommand: false,
        modulesPath: path.join(__dirname, "../resources", "WTS"),
        serverRoot: "dist",
        defaultModules: ["material.js", "app.js"]
    },
};
//# sourceMappingURL=proj-def.js.map