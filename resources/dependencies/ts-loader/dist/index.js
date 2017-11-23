"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var path = require("path");
var loaderUtils = require("loader-utils");
var instances_1 = require("./instances");
var utils_1 = require("./utils");
var constants = require("./constants");
var webpackInstances = [];
var loaderOptionsCache = {};
/**
 * The entry point for ts-loader
 */
function loader(contents) {
    this.cacheable && this.cacheable();
    var callback = this.async();
    var options = getLoaderOptions(this);
    var instanceOrError = instances_1.getTypeScriptInstance(options, this);
    if (instanceOrError.error !== undefined) {
        callback(instanceOrError.error);
        return;
    }
    return successLoader(this, contents, callback, options, instanceOrError.instance);
}
function successLoader(loader, contents, callback, options, instance) {
    var rawFilePath = path.normalize(loader.resourcePath);
    var filePath = options.appendTsSuffixTo.length > 0 || options.appendTsxSuffixTo.length > 0
        ? utils_1.appendSuffixesIfMatch({
            '.ts': options.appendTsSuffixTo,
            '.tsx': options.appendTsxSuffixTo,
        }, rawFilePath)
        : rawFilePath;
    var fileVersion = updateFileInCache(filePath, contents, instance);
    var _a = options.transpileOnly
        ? getTranspilationEmit(filePath, contents, instance, loader)
        : getEmit(rawFilePath, filePath, instance, loader), outputText = _a.outputText, sourceMapText = _a.sourceMapText;
    if (outputText === null || outputText === undefined) {
        var additionalGuidance = filePath.indexOf('node_modules') !== -1
            ? '\nYou should not need to recompile .ts files in node_modules.\nPlease contact the package author to advise them to use --declaration --outDir.\nMore https://github.com/Microsoft/TypeScript/issues/12358'
            : '';
        throw new Error("Typescript emitted no output for " + filePath + "." + additionalGuidance);
    }
    var _b = makeSourceMap(sourceMapText, outputText, filePath, contents, loader), sourceMap = _b.sourceMap, output = _b.output;
    // _module.meta is not available inside happypack
    if (!options.happyPackMode) {
        // Make sure webpack is aware that even though the emitted JavaScript may be the same as
        // a previously cached version the TypeScript may be different and therefore should be
        // treated as new
        loader._module.meta.tsLoaderFileVersion = fileVersion;
    }
    callback(null, output, sourceMap);
}
/**
 * either retrieves loader options from the cache
 * or creates them, adds them to the cache and returns
 */
function getLoaderOptions(loader) {
    // differentiate the TypeScript instance based on the webpack instance
    var webpackIndex = webpackInstances.indexOf(loader._compiler);
    if (webpackIndex === -1) {
        webpackIndex = webpackInstances.push(loader._compiler) - 1;
    }
    var loaderOptions = loaderUtils.getOptions(loader) || {};
    var configFileOptions = loader.options.ts || {};
    var instanceName = webpackIndex + '_' + (loaderOptions.instance || configFileOptions.instance || 'default');
    if (utils_1.hasOwnProperty(loaderOptionsCache, instanceName)) {
        return loaderOptionsCache[instanceName];
    }
    validateLoaderOptions(loaderOptions);
    var options = makeLoaderOptions(instanceName, configFileOptions, loaderOptions);
    loaderOptionsCache[instanceName] = options;
    return options;
}
var validLoaderOptions = ['silent', 'logLevel', 'logInfoToStdOut', 'instance', 'compiler', 'configFile', 'configFileName' /*DEPRECATED*/, 'transpileOnly', 'ignoreDiagnostics', 'visualStudioErrorFormat', 'compilerOptions', 'appendTsSuffixTo', 'appendTsxSuffixTo', 'entryFileIsJs', 'happyPackMode', 'getCustomTransformers'];
/**
 * Validate the supplied loader options.
 * At present this validates the option names only; in future we may look at validating the values too
 * @param loaderOptions
 */
function validateLoaderOptions(loaderOptions) {
    var loaderOptionKeys = Object.keys(loaderOptions);
    for (var i = 0; i < loaderOptionKeys.length; i++) {
        var option = loaderOptionKeys[i];
        var isUnexpectedOption = validLoaderOptions.indexOf(option) === -1;
        if (isUnexpectedOption) {
            throw new Error("ts-loader was supplied with an unexpected loader option: " + option + "\n\nPlease take a look at the options you are supplying; the following are valid options:\n" + validLoaderOptions.join(' / ') + "\n");
        }
    }
}
function makeLoaderOptions(instanceName, configFileOptions, loaderOptions) {
    var options = Object.assign({}, {
        silent: false,
        logLevel: 'INFO',
        logInfoToStdOut: false,
        compiler: 'typescript',
        configFile: 'tsconfig.json',
        transpileOnly: false,
        visualStudioErrorFormat: false,
        compilerOptions: {},
        appendTsSuffixTo: [],
        appendTsxSuffixTo: [],
        transformers: {},
        entryFileIsJs: false,
        happyPackMode: false,
    }, configFileOptions, loaderOptions);
    // Use deprecated `configFileName` as fallback for `configFile`
    if (loaderOptions.configFileName) {
        if (loaderOptions.configFile) {
            throw new Error('ts-loader options `configFile` and `configFileName` are mutually exclusive');
        }
        else {
            options.configFile = loaderOptions.configFileName;
        }
    }
    options.ignoreDiagnostics = utils_1.arrify(options.ignoreDiagnostics).map(Number);
    options.logLevel = options.logLevel.toUpperCase();
    options.instance = instanceName;
    // happypack can be used only together with transpileOnly mode
    options.transpileOnly = options.happyPackMode ? true : options.transpileOnly;
    return options;
}
/**
 * Either add file to the overall files cache or update it in the cache when the file contents have changed
 * Also add the file to the modified files
 */
function updateFileInCache(filePath, contents, instance) {
    // Update file contents
    var file = instance.files[filePath];
    if (file === undefined) {
        file = instance.files[filePath] = { version: 0 };
    }
    if (file.text !== contents) {
        file.version++;
        file.text = contents;
        instance.version++;
    }
    // push this file to modified files hash.
    if (!instance.modifiedFiles) {
        instance.modifiedFiles = {};
    }
    instance.modifiedFiles[filePath] = file;
    return file.version;
}
function getEmit(rawFilePath, filePath, instance, loader) {
    // Emit Javascript
    var output = instance.languageService.getEmitOutput(filePath);
    loader.clearDependencies();
    loader.addDependency(rawFilePath);
    var allDefinitionFiles = Object.keys(instance.files).filter(function (defFilePath) { return defFilePath.match(constants.dtsDtsxRegex); });
    // Make this file dependent on *all* definition files in the program
    var addDependency = loader.addDependency.bind(loader);
    allDefinitionFiles.forEach(addDependency);
    // Additionally make this file dependent on all imported files
    var fileDependencies = instance.dependencyGraph[filePath];
    var additionalDependencies = fileDependencies === undefined
        ? []
        : fileDependencies.map(function (module) { return module.originalFileName; });
    if (additionalDependencies) {
        additionalDependencies.forEach(addDependency);
    }
    loader._module.meta.tsLoaderDefinitionFileVersions = allDefinitionFiles
        .concat(additionalDependencies)
        .map(function (defFilePath) { return defFilePath + '@' + (instance.files[defFilePath] || { version: '?' }).version; });
    var outputFile = output.outputFiles.filter(function (outputFile) { return outputFile.name.match(constants.jsJsx); }).pop();
    var outputText = (outputFile) ? outputFile.text : undefined;
    var sourceMapFile = output.outputFiles.filter(function (outputFile) { return outputFile.name.match(constants.jsJsxMap); }).pop();
    var sourceMapText = (sourceMapFile) ? sourceMapFile.text : undefined;
    return { outputText: outputText, sourceMapText: sourceMapText };
}
/**
 * Transpile file
 */
function getTranspilationEmit(filePath, contents, instance, loader) {
    var fileName = path.basename(filePath);
    var _a = instance.compiler.transpileModule(contents, {
        compilerOptions: __assign({}, instance.compilerOptions, { rootDir: undefined }),
        transformers: instance.transformers,
        reportDiagnostics: true,
        fileName: fileName,
    }), outputText = _a.outputText, sourceMapText = _a.sourceMapText, diagnostics = _a.diagnostics;
    // _module.errors is not available inside happypack - see https://github.com/TypeStrong/ts-loader/issues/336
    if (!instance.loaderOptions.happyPackMode) {
        utils_1.registerWebpackErrors(loader._module.errors, utils_1.formatErrors(diagnostics, instance.loaderOptions, instance.compiler, { module: loader._module }));
    }
    return { outputText: outputText, sourceMapText: sourceMapText };
}
function makeSourceMap(sourceMapText, outputText, filePath, contents, loader) {
    if (sourceMapText === undefined) {
        return { output: outputText, sourceMap: undefined };
    }
    return {
        output: outputText.replace(/^\/\/# sourceMappingURL=[^\r\n]*/gm, ''),
        sourceMap: Object.assign(JSON.parse(sourceMapText), {
            sources: [loaderUtils.getRemainingRequest(loader)],
            file: filePath,
            sourcesContent: [contents]
        })
    };
}
module.exports = loader;
