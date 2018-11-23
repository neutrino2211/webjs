# wjs-cli:

![alt logo](docs/wjs-light.svg)

## CLI for making web and android apps with HTML , CSS and JS (ES7)

# Under development.

```bash
$ wjs help
wjs remove <file-name>
         - Remove an installed wjs package
wjs publish <path-to-module> --type=<task|module>
         - Publish a wjs package
wjs add <package>
         - Add any installed package to current project
wjs init <App-name> <option>
         - Initialize a project of the option type
         - options:
                 --javascript
                 --typescript
                 --react
                 --vue
                 --task
wjs install <module>
         - Install third party module
wjs tasks
         - List task runners installed
wjs run <task-alias>
         - run wjs tasks to see installed task runners
wjs development
         - Run the code compiler in watch mode
wjs build <platform?>
         - Compiles the code into a website if no target platform is specified
         - Supported platforms
                 -> Android
```

## Getting started

* First get node and npm

* Run `npm install wjs-cli -g`

* Run `wjs -v` to confirm installation

* Run `wjs init <app-name> <app-type>` where app type can be any of `--typescript` ,`--vue` ,  `--javascript`, `--react`

* Run `cd <app-name> && wjs development` to start the development server

* Open http://localhost:3100 in your browser to view the app

* Use `wjs install <package-name>` to install a package, which is either a module or task runner 

* To create an app with an android project in its directory use `wjs init <app-name> <app-type> --local` which makes a native project directory in your app folder, and to allow editing the android source code use `wjs init <app-name> <app-type> --local --package=<app-package-name>` which generates the default wjs android source

* Use `wjs tasks` to see installed task runners

* Use `wjs run <task-alias>` to run the task

* To build the app run `wjs build` and use `wjs build --android` to build the android app, but first make sure `ANDROID_HOME` is set.

## Examples

Documentation is not complete so the [exmaples](https://github.com/neutrino2211/webjs-examples) repo contains the best examples.

## Changelog

### wjs-cli@0.0.1

* Published wjs-cli on npm

### wjs-cli@0.0.2 

* Added install feature to allow installation of any third party module

### wjs-cli@0.0.3

* Created wjs-config.json file to allow specification of compile procedure and dependencies 

* Added `add` command to define project dependencies

* Changed bootstrap procedure to load `Application.onViewLoad` instead of `Application.main`

* Conducted unit tests for:
    1. Config file
    2. Compile procedure
    3. module installation
    4. Typescript application support

* Made basic typescript modules namely  `app.ts` , `web.ts (core)`, `http.ts` , `definitions.ts` , `material.ts`
### wjs-cli@0.0.4

* Bug fixes

* Fixed errors in docs

* Vue support

### wjs-cli@0.0.5

* More bug fixes

### wjs-cli@0.0.6

* Added android build

### wjs-cli@0.0.7

* Critical bug fix

### wjs-cli@0.0.8

* Critical bug fix

### wjs-cli@0.0.9

* Fix typos

### wjs-cli@0.1.0

* Bug fix

### wjs-cli@0.1.1

* Bug fix

### wjs-cli@0.1.2

* Added update feature

* Bug fix

### wjs-cli@0.1.3

* Support for Android ^5.0.0

* Added module publishinng

* Added [documentation for making modules](docs/create-modules.md)

### wjs-cli@0.1.4

* Fixed change-log error in readme

* Added task runner features

* Modularized source code

* Added option to initialize a local (Personal) android project option

* Added contributing.md

### wjs-cli@0.1.5

* Bug fixes

### wjs-cli@1.0.0

* Bug fixes

### wjs-cli@2.0.0

* Bug fixes

* Performance improvements

* NPM package support

### Coming soon

* iOS support


Feel free to open an issue at [the github repo](https://github.com/neutrino2211/webjs/issues)