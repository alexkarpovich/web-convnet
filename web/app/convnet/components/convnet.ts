import {Component} from 'angular2/core'
import {NgIf} from 'angular2/common'
import {ConvnetContainer} from './convnet-container'
import {ConvnetConfig} from './convnet-config'
import {ConvnetService} from "../services/convnet.service"

@Component({
    selector: 'convnet',
    template: `
        <div *ngIf="!initialized">Init connection...</div>
        <div *ngIf="initialized" class="convnet">
            <convnet-container></convnet-container>
            <convnet-config></convnet-config>
        </div>
    `,
    directives: [ConvnetContainer, ConvnetConfig, NgIf],
    providers: [ConvnetService]
})
export class Convnet {
    private initialized:boolean = false;

    constructor(private convnetService:ConvnetService) {
        this.convnetService.onopen(()=>this.initialized=true);
    }
}