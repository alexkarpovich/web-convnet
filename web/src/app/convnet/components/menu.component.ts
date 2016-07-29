import {Component} from '@angular/core';
import {NgIf} from '@angular/common';
import {DataService} from '../services/data.service';
import {IMessage} from '../convnet.d';
import {PopupDirective, PopupComponent} from '../../common/popup';

@Component({
    selector: 'convnet-menu',
    template: `
    <div class="menu">
        <button type="button" (click)="newNetwork()">New Network</button>
        <button *ngIf="!isTraining" type="button" (click)="startTraining()">Start traninig</button>
        <button *ngIf="isTraining" type="button" (click)="stopTraining()">Stop traninig</button>
        <button type="button" (click)="save()">Save</button>
        <button type="button" popup [popupComponent]="testing">Testing</button>
        <popup #testing>
            <header>Hello, i'm header</header>
            <content>Hello, i'm content</content>
            <footer>Hello, i'm footer</footer>
        </popup>
    </div>
    `,
    directives: [NgIf, PopupDirective, PopupComponent],
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
            minError: 0.01,
            learningRate: 0.001
        });
    }

    stopTraining() {
        this.dataService.stopTraining();
    }

    save() {
        this.dataService.save();
    }
}
