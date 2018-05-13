import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'my-app',
    template: '<h1>{{text}} and <strong>{{otherText}}</strong></h1>'
})

export class MainComponent implements OnInit {
    text: String = 'Hello world';
    otherText: String = 'welcome to angular with wjs-cli';

    constructor() {

    }

    ngOnInit() {
        console.log('Main component initialised');
    }
}