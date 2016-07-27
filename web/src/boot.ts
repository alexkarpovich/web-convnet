import './style.less'
import {provide} from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import {provideRouter} from '@angular/router';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {AppComponent} from './app/app.component';
import {AppRoutes} from './app/app.routes'

bootstrap(AppComponent, [
    provideRouter(AppRoutes),
    provide(APP_BASE_HREF, {useValue : '/' })
]);
