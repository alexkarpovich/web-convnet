import {Layer} from '../Layer'

export class FCLayer extends Layer {
    constructor(params:any) {
        super(params);
    }

    public feadforward() {
        console.log(this.type);
    }

    public backprop() {

    }
}
