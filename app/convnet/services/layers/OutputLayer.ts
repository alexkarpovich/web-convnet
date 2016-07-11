import {Layer} from '../Layer'
import {Utils} from '../utils'

export class OutputLayer extends Layer {
    private W:number[][];
    private deltas:number[];

    constructor(params:any) {
        super(params);
        this.deltas = [];
        this.initWeights();
    }

    private initWeights() {
        let prevSize = this.prev.getSize();
        this.W = [];
        for (let i=0; i<prevSize[0]; i++) {
            this.W[i] = [];

            for (let j=0; j<this.size[0]; j++) {
                this.W[i][j] = Utils.getRandom(-1, 1);
            }
        }
    }

    public feadforward() {
        let prevData = this.prev.getOutput();

        for (let j=0; j<this.size[0]; j++) {
            let S = 0;
            for (let i=0; i<this.prev.getSize()[0];i++) {
                S+=prevData.out[i]*this.W[i][j];
            }
            this.in[j] = S;
            this.out[j] = Utils.sigmoid(S);
        }

        this.net.setOutput(this.out);
    }

    public backprop() {
        let label = this.net.getLabel();
        let prevConfig = this.prev.getConfig();
        let prevOutput = this.prev.getOutput()['out'];
        
        for (let i=0; i<this.size[0]; i++) {
            this.deltas[i] = label[i] - this.out[i];
        }

        for (let j=0; j<this.size[0]; j++) {
            for (let i=0; i<prevConfig['size'][0];i++) {
                this.W[i][j]+=0.001*this.deltas[j]*Utils.sigmoidDerivative(this.in[j])*prevOutput[i];
            }
        }
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

    public getInput() {
        return this.in;
    }

    public getError() {
        return this.deltas.reduce((prev,current) => {
            return Math.pow(prev,2)+Math.pow(current,2);
        })/2;
    }
}
