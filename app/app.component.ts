import './style.less'
import {Component} from 'angular2/core'
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router'
import {Main} from './convnet/components/main'

@Component({
    selector: 'app',
    template: `
		<div class="main">
		 	<router-outlet></router-outlet>
		</div>
    `,
    directives: [ROUTER_DIRECTIVES, Main]
})
@RouteConfig([
	{path: '/', name: 'Main', component: Main}
])
export class AppComponent {}
