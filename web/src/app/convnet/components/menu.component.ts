import {Component} from '@angular/core';
import {NgIf} from '@angular/common';
import {DataService} from '../services/data.service';
import {IMessage} from '../convnet.d';
import {PopoverDirective, PopoverComponent} from '../../common/popover';

@Component({
    selector: 'convnet-menu',
    template: `
    <div class="menu">
        <button type="button" (click)="newNetwork()">New Network</button>
        <button *ngIf="!isTraining" type="button" (click)="startTraining()">Start traninig</button>
        <button *ngIf="isTraining" type="button" (click)="stopTraining()">Stop traninig</button>
        <button type="button" (click)="save()">Save</button>
        <button type="button" popover="" [popoverComponent]="testing">Testing</button>
        <popover #testing >
            <div style="width: 200px;">Hello, i'm content</div>
        </popover>
    </div>
    `,
    directives: [NgIf, PopoverDirective, PopoverComponent],
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
    private isTraining: boolean = false;

    constructor(private dataService: DataService) {
        this.dataService.stream$.subscribe((msg: IMessage) => {
            switch (msg.type) {
                case 'training:state': this.isTraining = msg.data; break;
            }
        });

        this.dataService.trainingState();
    }

    startTraining() {
        this.dataService.startTraining({
            maxIterations: 1000,
            minError: 1,
            learningRate: 0.1
        });
    }

    stopTraining() {
        this.dataService.stopTraining();
    }

    save() {
        this.dataService.save();
    }
}
