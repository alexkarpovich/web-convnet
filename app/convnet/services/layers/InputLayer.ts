import {Layer} from '../Layer'
import {Utils} from '../utils'

interface IInputPrams {
    image:ImageData;
}

export class InputLayer extends Layer {
    private image:ImageData;
    private out:number[];

    constructor(params:any) {
        super(params);
        this.image = params.image;
        this.out = Utils.img2data(this.image);
    }

    public getOut() {
        return this.out;
    }

    public getImage() {
        return this.image;
    }
}
