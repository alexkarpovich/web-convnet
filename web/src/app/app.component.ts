import '../style/app.scss';
import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import TestServiceWorker = require('serviceworker?name=test.service!./workers/test.serviceworker');

@Component({
    selector: 'app',
    template: `
    <div class="main">
        <router-outlet></router-outlet>
    </div>
    `,
    directives: [...ROUTER_DIRECTIVES]
})
export class AppComponent {
    constructor() {
        if ('serviceWorker' in navigator) {
            TestServiceWorker({scope: '/'}).then(() => console.log('succes'), () => console.log('error'));
        }
    }
}
