import '../style/app.scss';
import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

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
    }
}
