import {Component} from '@angular/core'
import {NgIf} from '@angular/common'
import {DataService} from '../services/data.service'
import {ConvnetView} from './view'
import {ConvnetReadings} from './readings'

@Component({
    selector: 'convnet-container',
    template: `
    <div class="convnet-container">
        <div *ngIf="isEditing">
            <convnet-setup></convnet-setup>
        </div>
        <div *ngIf="!isEditing">
            <convnet-view></convnet-view>
            <convnet-readings></convnet-readings>
        </div>
    </div>
    `,
    directives: [NgIf, ConvnetView, ConvnetReadings]
})
export class ConvnetContainer {
    isEditing:boolean;

    constructor(private dataService:DataService) {
        this.isEditing = dataService.isEditing;
        this.dataService.editing$.subscribe((val:boolean) => this.isEditing=val);
    }

}