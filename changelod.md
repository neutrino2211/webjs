# wjs-cli changelog

## wjs-cli@0.0.1 -> wjs-cli@0.1.5

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

* Added [documentation for module creation](docs/Modules/introduction.md)

### wjs-cli@0.1.4

* Fixed change-log error in readme

* Added task runner features

* Modularized source code

* Added option to initialize a local (Personal) project option

* Added contributing.md

### wjs-cli@0.1.5

* Bug fixes

## wjs-cli@1.0.0

### wjs-cli@1.0.0

* Removal of the following modules
    1. device.js
    2. facebook.js
    3. firebase.js
    4. definitions.js
    5. crypto.js
    6. phaser.js
    7. forms.js
    8. http.js
    9. ui.js
    10. web.js (core)

    These modules were removed for either one of the following reasons

    * Module no longer needed due to change in compiler
    * Module contains obsolete code
    * Module not used often and so takes up valuable space

* Removal of `run-dev` command

* Parcel bundler now used instead of webpack

* Adoption of express as development server