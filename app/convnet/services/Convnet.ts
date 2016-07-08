import {Injectable} from 'angular2/core'
import {Utils} from './utils'
import {Layer} from './Layer'
import {InputLayer} from './layers/InputLayer'
import {ConvLayer} from './layers/ConvLayer'
import {FCLayer} from './layers/FCLayer'
import {OutputLayer} from './layers/OutputLayer'

interface IConvnetParams {
    layers:any[];
};

@Injectable()
export class Convnet {
    private layers:any[];

    constructor(params:IConvnetParams) {
        this.initLayers(params.layers);
    }

    private initLayers(layers:any) {
        this.layers = [];
        let prevLayer = null;

        layers.forEach(layer => {
            let currentLayer;
            layer.prev = prevLayer;

            switch(layer.type) {
                case 'input':
                    currentLayer = new InputLayer(layer);
                    break;
                case 'conv':
                    currentLayer = new ConvLayer(layer);
                    break;
                case 'fc':
                    currentLayer = new FCLayer(layer);
                    break;
                case 'output':
                    currentLayer = new OutputLayer(layer);
                    break;
            }

            this.layers.push(currentLayer);
            prevLayer = currentLayer;
        });
    }

    public feadforward() {
        this.layers.forEach(layer => layer.feadforward());
    }
}
