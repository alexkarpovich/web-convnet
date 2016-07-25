import {Component} from 'angular2/core'
import {NgIf} from 'angular2/common'
import {ConvnetService} from '../services/convnet.service'
import {ConvnetView} from './convnet-view'
import {ConvnetSetup} from './convnet-setup'

@Component({
    selector: 'convnet-container',
    template: `
    <div class="convnet-container">
        <h6 class="panel-title">convnet container</h6><hr />
        <div *ngIf="isEditing">
            <convnet-setup></convnet-setup>
        </div>
        <div *ngIf="!isEditing">
            <convnet-view></convnet-view>
        </div>
    </div>
    `,
    directives: [NgIf, ConvnetView, ConvnetSetup]
})
export class ConvnetContainer {
    isEditing:boolean;

    constructor(private convnetService:ConvnetService) {
        this.isEditing = convnetService.isEditing;
        this.convnetService.editing$.subscribe(val => this.isEditing=val);
    }

}