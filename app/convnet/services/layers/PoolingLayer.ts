import {Layer} from '../Layer'
import {Utils} from '../utils'

export class PoolingLayer extends Layer {
    private deltas:number[];

    constructor(params:any) {
        super(params);
        this.deltas = [];
    }

    private downsample(convolved:number[]):number[] {
        let result = [];
        let p = 0;
        let size = this.prev.getConfig()['size'];

        for (let i=0; i<size[0]; i+=this.size[0]) {
            for (let j=0; j<size[1]; j+=this.size[1]) {
                let v = [], highIndex = i+size[0]*j;

                for (let k=0; k<this.size[0]; k++) {
                    for (let t=0; t<this.size[1]; t++) {
                        v.push(this.in[highIndex+k+t*size[0]]);
                    }
                }

                result[p++] = Math.max.apply(null, v);
            }
        }

        return result;
    }

    public feadforward() {
        this.in = this.prev.getOutput()['out'];
        this.out = [];

        for (let i=0; i<this.prev.getCount(); i++) {
            this.out = this.out.concat(this.downsample(this.in));
        }
    }

    public backprop() {
        let nextDeltas = this.next.getDeltas();
        let nextInput = this.next.getInput();
        let nextWeights = this.next.getWeights();

        for (let i = 0; i < this.out.length; i++) {
            let v = 0;

            for (let k=0; k<nextInput.length; k++) {
                v -= nextDeltas[k]*Utils.sigmoidDerivative(nextInput[k])*nextWeights[i][k];
            }

            this.deltas[i] = v;
        }
    }

    public getConfig() {
        let prevConfig = this.prev.getConfig();

        return {
            type: this.getType(),
            size: [prevConfig.size[0]/this.size[0], prevConfig.size[1]/this.size[1]],
            count: prevConfig.featureCount
        };
    }

    public getOutput() {
        return {out: this.out, count: this.prev.getCount()};
    }

    public getDeltas() {
        return this.deltas;
    }
}
