import {Layer} from '../Layer'

export class OutputLayer extends Layer {
    private in:number[];
    private out:number[];

    constructor(params:any) {
        super(params);
    }

    public feadforward() {
        console.log(this.type);
    }

    public backprop() {

    }
}
