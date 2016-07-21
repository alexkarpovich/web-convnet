import {Component} from 'angular2/core'
import {NgFor, NgModel} from 'angular2/common'
import {SetupLayer} from './setup-layer'
import {ConvnetService} from '../services/convnet.service'

@Component({
    selector: 'convnet-setup',
    template: `
    <div class="convnet-setup">
        <label for="inputSize">Input Size: </label>
        <input type="number" class="inputSize" [(ngModel)]="_size[0]" />
        <input type="number" class="inputSize" [(ngModel)]="_size[1]" />
        <label>Layers: </label>
        <setup-layer *ngFor="let l of _layers; let i=index" [(layer)]="_layers[i]"></setup-layer>
        <div class="controls">
            <button type="button" (click)="addLayer()">add layer</button>
            <button type="button" (click)="saveLayers()">save</button>
            <button type="button" (click)="cancel()">cancel</button>
        </div>
    </div>
    `,
    directives: [SetupLayer, NgFor, NgModel]
})
export class ConvnetSetup {
    private _size:number[] = [28, 28];
    private _layers:any[] = [];

    constructor(private convnetService:ConvnetService) {}

    addLayer() {
        this._layers.push({type: "", size: [], count: 0, shape: ""});
    }

    saveLayers() {
        this.convnetService.setupNetwork({
            size: this._size,
            layers: this._layers
        });
        this.convnetService.isEditing = false;
    }

    cancel() {
        this.convnetService.isEditing = false;
    }
}
