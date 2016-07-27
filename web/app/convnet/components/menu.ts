import {Component} from 'angular2/core'
import {NgIf} from 'angular2/common'
import {DataService} from '../services/data.service'
import {IMessage} from "../definitions/convnet";

@Component({
    selector: 'convnet-menu',
    template: `
    <div class="convnet-menu">
        <button type="button" (click)="newNetwork()">New Network</button>
        <button *ngIf="!isTraining" type="button" (click)="startTraining()">Start traninig</button>
        <button *ngIf="isTraining" type="button" (click)="stopTraining()">Stop traninig</button>
        <button type="button" (click)="save()">Save</button>
    </div>
    `,
    directives: [NgIf]
})
export class ConvnetMenu {
    private isTraining:boolean = false;

    constructor(private dataService:DataService) {
        this.dataService.stream$.subscribe((msg:IMessage) => {
            switch(msg.type) {
                case 'training:state': this.isTraining = msg.data; break;
            }
        });

        this.dataService.trainingState();
    }

    newNetwork() {}

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