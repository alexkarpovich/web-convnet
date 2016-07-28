import {Component} from '@angular/core';
import {NgIf} from '@angular/common';
import {DataService} from '../services/data.service';
import {ViewComponent} from './view.component';
import {ReadingsComponent} from './readings.component';

@Component({
    selector: 'convnet-container',
    template: `
    <div class="container">
        <div *ngIf="isEditing">
            <convnet-setup></convnet-setup>
        </div>
        <div *ngIf="!isEditing">
            <convnet-view></convnet-view>
            <convnet-readings></convnet-readings>
        </div>
    </div>
    `,
    directives: [NgIf, ViewComponent, ReadingsComponent],
    styleUrls: ['./container.component.scss']
})
export class ContainerComponent {
    isEditing: boolean;

    constructor(private dataService: DataService) {
        this.isEditing = dataService.isEditing;
        this.dataService.editing$.subscribe((val: boolean) => this.isEditing = val);
    }

}
