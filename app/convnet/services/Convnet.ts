import {Injectable} from 'angular2/core'
import {Utils} from './utils'

interface IConvnetParams {
    image:ImageData,
    layers:any[]
};

@Injectable()
export class Convnet {
    private W:number[][][];
    private in:number[];
    private width:number;
    private height:number;

    constructor(params:any) {
        this.width = params.image.width;
        this.height = params.image.height;
        this.in = Utils.img2data(params.image);
        this.initLayers();
    }

    private initLayers(layers:any) {
        layers.forEach(layer => {
            this.layers.push(new Layer())
        });
    }
}
