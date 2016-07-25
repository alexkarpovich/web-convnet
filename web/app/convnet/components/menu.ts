import {Component} from 'angular2/core'

@Component({
    selector: 'convnet-menu',
    template: `
    <div class="convnet-menu">
        <button type="button" (click)="newNetwork()">New Network</button>
    </div>
    `
})
export class ConvnetMenu {
    constructor() {}
}