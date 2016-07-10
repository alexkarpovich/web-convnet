import {Convnet} from './Convnet';

interface ILayerParams {
    type:string;
    prev?:any;
    next?:any;
    activate?:string;
    size?:number[];
    net:Convnet;
}

export enum LayerType {
    CONV, POOLING, FC, OUTPUT
}

export class Layer {
    protected net:Convnet;
    protected prev:any;
    protected next:any;
    protected type:LayerType;
    protected activate:string;
    protected size:number[];
    protected in:number[];
    protected out:number[];

    constructor(params:ILayerParams) {
        this.net = params.net;
        this.prev = params.prev;
        this.type = this.getTypeFromString(params.type);
        this.activate = params.activate;
        this.size = params.size;
        this.in = [];
        this.out = [];
    }

    private getTypeFromString(type:string):LayerType {
        switch(type) {
            case 'conv': return LayerType.CONV;
            case 'pooling': return LayerType.POOLING;
            case 'fc': return LayerType.FC;
            case 'output': return LayerType.OUTPUT;
            default: return null;
        }
    }

    public getSize() {
        return this.size;
    }

    public getType() {
        return this.type;
    }

    public setNextLayer(next:any) {
        this.next = next;
    }

    public getConfig() {}

    public getOutput() {}

    public feadforward() {}

    public backprop() {}
}
