import {Component, ViewChild, Input, EventEmitter, ApplicationRef} from 'angular2/core'
import {NgFor} from 'angular2/common'
import {ConvnetService} from '../services/ConvnetService'
import {LayerView} from './layer-view'

@Component({
    selector: 'convnet-view',
    template: `
        <div class="convnet-view">
            <canvas #output width="1000" height="100"></canvas>
            <div *ngFor="let layer of layers">
                <layer-view [layer]="layer"></layer-view>
            </div>
            <button id="getState" (click)="getState()">Get State</button>
        </div>
    `,
    directives: [NgFor, LayerView]
})
export class ConvnetView {
    @Input() convnetService:ConvnetService;
    @ViewChild('output', true) output:any;
    private image:ImageData;
    private layers:any[];

    constructor(private applicationRef:ApplicationRef) {}

    getState() {
        this.convnetService.getState(state => this.prepareData(state));
    }

    prepareData(state:any) {
        this.image = this.data2img(state.input, state.size[0], state.size[1], 1)[0];
        this.layers = [];
        let cnv = this.output.nativeElement;
        let cnx = cnv.getContext('2d');

        cnx.putImageData(this.image, 0, 0);

        state.layers.forEach(layer => {
            if([0, 1].indexOf(layer.type) !== -1) {
                layer['images'] = this.data2img(layer.output, layer.outSize[0], layer.outSize[1], layer.count);

            }

            this.layers.push(layer);
        });
    }

    data2img(data:number[], w:number, h:number, count:number) {
        let result = [], step = w*h;
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');

        for (let i=0; i<count; i++) {
            let offset = step*i;
            result[i] = context.createImageData(w, h);

            for (let j=0; j<w; j++) {
                for (let k=0; k<h; k++) {
                    let srcP = j+w*k;
                    let p = 4*srcP, value = data[srcP+offset];
                    result[i].data[p] = result[i].data[p+1] = result[i].data[p+2] = value;
                    result[i].data[p+3] = 255;
                }
            }
        }

        return result;
    }
}