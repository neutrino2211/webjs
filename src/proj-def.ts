var path = require("path");

export const definitions = {
    typescript: {
        root: "src",
        entry:"src/index.html",
        serverRoot: "dist",
        testPackages: ['karma-typescript'],
        color: [0x00,0x00,0xe4]
    },

    angular: {
        root: "src",
        entry:"src/index.html",
        serverRoot: "dist",
        color: [0xb5,0xe2,0x31]
    },

    vue: {
        root: "src",
        entry: "src/index.html",
        serverRoot: "dist",
        color: [0x42,0xb8,0x82]
    },

    react: {
        root: "src",
        entry: "src/index.html",
        serverRoot: "dist",
        testPackages: [],
        color: [0x00,0xb3,0xe6]
    },

    javascript: {
        root: "src",
        entry: "src/index.html",
        serverRoot: "dist",
        testPackages: [],
        color: [0x88,0x9f,0x0e]
    },

    tests: {
        jasmine: {
            spec_dir: 'test'
        }
    }
}
export default definitions;