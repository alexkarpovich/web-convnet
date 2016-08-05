import {provideRouter, RouterConfig} from '@angular/router';
import {ConvnetComponent} from './convnet';
import {BasicComponent} from './settings';

export const routes: RouterConfig = [
    {path: '', component: ConvnetComponent},
    {path: 'settings', component: BasicComponent}
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
