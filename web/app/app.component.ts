import './style.less'
import {Component} from 'angular2/core'
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router'
import {Convnet} from './convnet/components/convnet'

@Component({
    selector: 'app',
    template: `
		<div class="main">
		 	<router-outlet></router-outlet>
		</div>
    `,
    directives: [ROUTER_DIRECTIVES, Convnet]
})
@RouteConfig([
	{path: '/', name: 'Convnet', component: Convnet}
])
export class AppComponent {

}
