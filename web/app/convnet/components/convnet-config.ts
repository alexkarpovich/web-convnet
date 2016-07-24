import {Component} from 'angular2/core'
import {NgModel} from 'angular2/common'
import {ConvnetService} from '../services/convnet.service'
import {ITrainParams} from '../interfaces/convnet'

@Component({
    selector: 'convnet-config',
    template: `
    <div class="convnet-config">
        <h6 class="panel-title">configurations</h6><hr />
        <button type="button" (click)="newNetwork()">New Network</button><br />
        <label for="maxIterations">Max Iterations:</label>
        <input type="text" id="maxIterations" [(ngModel)]="_trainParams.maxIterations" />
        <label for="minError">Min Error:</label>
        <input type="text" id="minError" [(ngModel)]="_trainParams.minError" />
        <label for="learningRate">Learning Rate:</label>
        <input type="text" id="learningRate" [(ngModel)]="_trainParams.learningRate" />
        <button type="button" (click)="train()">Train</button>
        <button type="button" (click)="save()">Save</button>
    </div>
    `,
    directives: [NgModel]
})
export class ConvnetConfig {
    private _trainParams:ITrainParams = {
        maxIterations: 1000,
        minError: 0.01,
        learningRate: 0.001
    };
    constructor(private convnetService:ConvnetService) {}

    newNetwork() {
        this.convnetService.isEditing = true;
    }

    train() {
        this.convnetService.train(this._trainParams);
    }

    save() {
        this.convnetService.save()
    }
}