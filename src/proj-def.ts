var path = require("path");

export const definitions = {
    typescript: {
        root: "src",
        entry:"src/index.html",
        serverRoot: "dist",
        testPackages: ['karma-typescript']
    },

    angular: {
        root: "src",
        entry:"src/index.html",
        serverRoot: "dist",
    },

    vue: {
        root: "src",
        entry: "src/index.html",
        serverRoot: "dist",
    },

    react: {
        root: "src",
        entry: "src/index.html",
        serverRoot: "dist",
        testPackages: []
    },

    javascript: {
        root: "src",
        entry: "src/index.html",
        serverRoot: "dist",
        testPackages: []
    },

    tests: {
        jasmine: {
            spec_dir: 'test'
        }
    }
}
export default definitions;