import {Layer} from '../Layer';

export class InputLayer extends Layer {
    private in:number[];
    private out:number[];
    private width:number;
    private height:number;

    constructor(params:any) {
        this.in = params.in||null;
        this.width = params.width||null;
        this.height = params.height||null;
    }

    public getData() {
        !this.out && this.grayscale();

        return this.out;
    }

    private grayscale() {
        let d = this.in;

        for (let i=0;i<this.in.length;i+=4) {
            this.out[i] = this.out[i+1] =
                this.out[i+2] = 0.2989*d[i] + 0.5870*d[i+1] + 0.1140*d[i+2];
        }

        return this.out;
    }
}
