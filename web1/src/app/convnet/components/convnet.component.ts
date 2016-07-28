import {Component} from '@angular/core';
import {NgIf} from '@angular/common';
import {DataService} from '../services/data.service';
import {ConvnetMenu} from './menu.component';
import {ConvnetContainer} from './container.component';

@Component({
    selector: 'convnet',
    template: `
        <div *ngIf="!connected">Init connection...</div>
        <div *ngIf="connected" class="convnet">
            <convnet-menu></convnet-menu> 
            <convnet-container></convnet-container> 
        </div>
    `,
    styleUrls: ['./convnet.component.scss'],
    directives: [NgIf, ConvnetMenu, ConvnetContainer],
    providers: [DataService]
})
export class Convnet {
    private connected: boolean = false;

    constructor(private dataService: DataService) {
        this.dataService.onopen(() => this.connected = true);
    }
}
