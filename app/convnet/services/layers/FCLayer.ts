import {Layer} from '../Layer'
import {Utils} from '../utils'

export class FCLayer extends Layer {
    private W:number[][];
    private deltas:number[];

    constructor(params:any) {
        super(params);
        this.deltas = [];
        this.initWeights();
    }

    private initWeights() {
        let prevConfig = this.prev.getConfig();
        this.W = [];
        for (let i=0; i<prevConfig.size[0]*prevConfig.size[1]*prevConfig.count; i++) {
            this.W[i] = [];

            for (let j=0; j<this.size[0]; j++) {
                this.W[i][j] = Utils.getRandom(-1, 1);
            }
        }
    }

    public feadforward() {
        let prevData = this.prev.getOutput()['out'];

        for (let j=0; j<this.size[0]; j++) {
            let S = 0;
            for (let i=0; i<prevData.length;i++) {
                S+=prevData[i]*this.W[i][j];
            }
            this.in[j] = S;
            this.out[j] = Utils.sigmoid(S);
        }
    }

    public backprop() {
        let prevConfig = this.prev.getConfig();
        let prevOutput = this.prev.getOutput()['out'];
        let nextDeltas = this.next.getDeltas();
        let nextInput = this.next.getInput();
        let nextWeights = this.next.getWeights();

        for (let i = 0; i < this.size[0]; i++) {
            let v = 0;

            for (let k=0; k<nextInput.length; k++) {
                v -= nextDeltas[k]*Utils.sigmoidDerivative(nextInput[k])*nextWeights[i][k];
            }

            this.deltas[i] = v;
        }

        for (let j=0; j<this.size[0]; j++) {
            for (let i=0; i<prevConfig['size'][0];i++) {
                this.W[i][j]+=0.1*this.deltas[j]*Utils.sigmoidDerivative(this.in[j])*prevOutput[i];
            }
        }
    }

    public getConfig() {
        return {
            type: this.getType(),
            size: this.getSize()
        };
    }

    public getInput() {
        return this.in;
    }

    public getOutput() {
        return {out: this.out};
    }

    public getDeltas() {
        return this.deltas;
    }

    public getWeights() {
        return this.W;
    }
}
