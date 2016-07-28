import {Component} from '@angular/core';
import {NgIf} from '@angular/common';
import {DataService} from '../services/data.service';
import {MenuComponent} from './menu.component';
import {ContainerComponent} from './container.component';

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
    directives: [NgIf, MenuComponent, ContainerComponent],
    providers: [DataService]
})
export class ConvnetComponent {
    private connected: boolean = false;

    constructor(private dataService: DataService) {
        this.dataService.onopen(() => this.connected = true);
    }
}
