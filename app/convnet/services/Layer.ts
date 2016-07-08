interface ILayerParams {
    type:string;
    prev?:Layer;
    activate?:string;
    size?:number;
}

export enum LayerType {
    INPUT, CONV, FC, OUTPUT
}

export class Layer {
    protected prev:any;
    protected type:LayerType;
    protected activate:string;
    protected size:number;

    constructor(params:ILayerParams) {
        this.prev = params.prev;
        this.type = this.getTypeFromString(params.type);
        this.activate = params.activate;
        this.size = params.size;
    }

    private getTypeFromString(type:string):LayerType {
        switch(type) {
            case 'input': return LayerType.INPUT;
            case 'conv': return LayerType.CONV;
            case 'fc': return LayerType.FC;
            case 'output': return LayerType.OUTPUT;
            default: return null;
        }
    }

    public feadforward() {}

    public backprop() {}
}
