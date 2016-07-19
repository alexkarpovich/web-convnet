import {Component} from 'angular2/core'
import {ConvnetService} from '../services/convnet.service'

@Component({
    selector: 'convnet-config',
    template: `
    <div class="convnet-config">
        <h6 class="panel-title">configurations</h6><hr />
        <button type="button" (click)="newNetwork()">New Network</button>
    </div>
    `
})
export class ConvnetConfig {
    constructor(private convnetService:ConvnetService) {}

    newNetwork() {
        this.convnetService.isEditing = true;
    }
}