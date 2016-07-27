import {Component} from '@angular/core'
import {NgIf} from '@angular/common'
import {DataService} from '../services/data.service'
import {ConvnetMenu} from './menu'
import {ConvnetContainer} from './container'

@Component({
    selector: 'convnet',
    template: `
        <div *ngIf="!connected">Init connection...</div>
        <div *ngIf="connected" class="convnet">
            <convnet-menu></convnet-menu> 
            <convnet-container></convnet-container> 
        </div>
    `,
    directives: [NgIf, ConvnetMenu, ConvnetContainer],
    providers: [DataService]
})
export class Convnet {
    private connected:boolean = false;

    constructor(private dataService:DataService) {
        this.dataService.onopen(()=>this.connected=true);
    }
}