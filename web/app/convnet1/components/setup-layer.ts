import {Component, Input, Output, EventEmitter} from 'angular2/core'
import {NgModel, NgIf} from 'angular2/common'

@Component({
    selector: 'setup-layer',
    template: `
    <div class="setup-layer">
        <select id="layerType" class="layer-type" [(ngModel)]="layer.type" (ngModelChange)="updateModel()">
            <option value="" disabled>Type</option>
            <option *ngFor="let t of types" [value]="t" >{{t}}</option>
        </select>
        <input type="number" class="layer-size" [(ngModel)]="layer.size[0]" (ngModelChange)="updateModel($event)"/>
        <input type="number" class="layer-size" [(ngModel)]="layer.size[1]" (ngModelChange)="updateModel($event)"/>
        <input *ngIf="layer.type=='conv'" type="number" class="layer-count" [(ngModel)]="layer.count" (ngModelChange)="updateModel($event)"/>
        <select *ngIf="layer.type=='conv'" [(ngModel)]="layer.shape" class="layer-shape" (ngModelChange)="updateModel($event)">
            <option value="" disabled>Shape</option>
            <option *ngFor="let s of shapes" [value]="s" >{{s}}</option>
        </select>
    </div>
    `,
    directives: [NgModel, NgIf]
})
export class SetupLayer {
    @Input() layer:any;
    @Output() layerChange:EventEmitter<any> = new EventEmitter();

    private types:string[] = ['conv', 'pool', 'fc', 'output'];
    private shapes:string[] = ['valid', 'same', 'full'];

    constructor() {}

    updateModel() {
        this.layerChange.emit(this.layer);
    }
}