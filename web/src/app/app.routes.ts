import { provideRouter, RouterConfig } from '@angular/router';
import { ConvnetComponent } from './convnet';

export const routes: RouterConfig = [
  { path: '', component: ConvnetComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
