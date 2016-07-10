import {Layer} from '../Layer'
import {Utils} from '../utils'

export enum ConvShape {
    VALID, SAME, FULL
}

export class ConvLayer extends Layer {
    private inWidth:number;
    private inHeight:number;
    private image:number[];
    private shape:ConvShape;
    private K:number[][];
    private count:number;
    private deltas:number[];

    constructor(params:any) {
        super(params);
        this.shape = this.getShapeFromString(params.shape);
        this.count = params.count;
        this.init();
    }

    private init():void {
        this.K = [];
        let kernelSize = this.size[0]*this.size[1];

        for (let i=0;i<this.count;i++) {
            this.K[i] = [];
            for (let j=0; j<kernelSize; j++) {
                this.K[i][j] = Utils.getRandom(-1, 1);
            }
        }
    }

    private prepareInput():void {
        switch(this.shape) {
            case ConvShape.VALID: return this.convertToValid();
            case ConvShape.SAME: return this.convertToSame();
            case ConvShape.FULL:
            default: return this.convertToFull();
        }
    }

    private convertToValid():void {
        let prevSize = this.net.getSize();

        this.image = this.net.getInput();
        this.inWidth = prevSize[0];
        this.inHeight = prevSize[1];

    }

    private convertToSame() {
        let prevSize = this.net.getSize();
        let out = this.net.getInput();
        let fPad, sPad, result = [];
        let isEven = this.size[0]%2==0;
        if(isEven) {
            fPad = ~~(this.size[0] / 2);
            sPad = ~~(fPad / 2);
        } else {
            fPad = sPad = ~~(this.size[0] / 2);
        }

        this.inWidth = prevSize[0]+fPad+sPad;
        this.inHeight = prevSize[1]+fPad+sPad;

        for (let i=0; i<this.inWidth; i++) {
            for (let j=0; j<this.inHeight; j++) {
                if(i<fPad || i>prevSize[0]+fPad-1 || j<fPad || j>prevSize[1]+fPad-1) {
                    result[i+this.inWidth*j] = 0;
                } else {
                    result[i+this.inWidth*j] = out[i-fPad+prevSize[0]*(j-fPad)];
                }
            }
        }

        this.image = result;
    }

    private convertToFull() {
        let prevSize = this.net.getSize();
        let out = this.net.getInput();
        let pad = this.size[0]-1,
            result = [];

        this.inWidth = prevSize[0]+2*pad;
        this.inHeight = prevSize[1]+2*pad;

        for (let i=0; i<this.inWidth; i++) {
            for (let j=0; j<this.inHeight; j++) {
                if(i<pad || i>prevSize[0]+pad-1 || j<pad || j>prevSize[1]+pad-1) {
                    result[i+this.inWidth*j] = 0;
                } else {
                    result[i+this.inWidth*j] = out[i-pad+prevSize[0]*(j-pad)];
                }
            }
        }

        this.image = result;
    }

    private conv(kernel:number[]):any {
        let result = {S:[], A:[]};
        let p = 0;
        let xRange = this.inWidth-this.size[0];
        let yRange = this.inHeight-this.size[1];

        for (let i=0; i<=xRange; i++) {
            for (let j=0; j<=yRange; j++) {
                let v = 0;

                for (let k=0; k<this.size[0]; k++) {
                    for (let t=0; t<this.size[1]; t++) {
                        v += this.image[i+this.inWidth*j+k+t*this.inWidth] * kernel[k+this.size[0]*t];
                    }
                }

                result.S[p] = v;
                result.A[p++] = Utils.sigmoid(v);
            }
        }

        return result;
    }

    public feadforward() {
        this.prepareInput();
        this.in = [];
        this.out = [];

        for (let i=0; i<this.count; i++) {
            let result = this.conv(this.K[i]);
            this.in = this.in.concat(result.S);
            this.out = this.out.concat(result.A);
        }
    }

    public backprop() {
        let nextDeltas = this.next.getDeltas();
        let subsize = this.next.getSize();
        let convSize = this.getConvolvedSize();
        let p = 0;
        this.deltas = [];

        for (let i=0; i<this.count; i++) {
            for (let j=0; j<convSize[0]; j+=subsize[0]) {
                for (let k=0; k<convSize[1]; k+=subsize[1], p++) {
                    let delta = nextDeltas[p]/(subsize[0]*subsize[1]);

                    for (let a=0; a<subsize[0]; a++) {
                        for (let b=0; b<subsize[1]; b++) {
                            this.deltas[j+convSize[0]*k+a+b*convSize[0]+i*convSize[0]*convSize[1]] = delta;
                        }
                    }
                }
            }
        }

        let xRange = this.inWidth-this.size[0];
        let yRange = this.inHeight-this.size[1];
        p = 0;

        for (let i=0; i<this.count; i++) {
            for (let j=0; j<xRange; j++) {
                for (let k=0; k<yRange; k++,p++) {
                    for (let a=0; a<this.size[0]; a++) {
                        for (let b=0; b<this.size[1]; b++) {
                            this.K[i][a+this.size[0]*b] +=
                                0.001*this.deltas[p]*Utils.sigmoidDerivative(this.in[p])*this.image[j+this.inWidth*k+a+b*this.inWidth];
                        }
                    }
                }
            }
        }
    }

    private getShapeFromString(shape:string) {
        switch(shape) {
            case 'valid': return ConvShape.VALID;
            case 'same': return ConvShape.SAME;
            case 'full': return ConvShape.FULL;
            default: return null;
        }
    }

    private getConvolvedSize() {
        let prevSize = this.net.getSize();

        switch(this.shape) {
            case ConvShape.VALID:
                return [prevSize[0]-this.size[0]+1, prevSize[1]-this.size[0]+1];
            case ConvShape.SAME:
                return [prevSize[0], prevSize[1]];
            case ConvShape.FULL:
            default:
                return [prevSize[0]+this.size[0]-1, prevSize[1]+this.size[1]-1];
        }
    }

    private getCount() {
        return this.count;
    }

    public getConfig() {
        return {
            type: this.getType(),
            kernelSize: this.getSize(),
            featureCount: this.count,
            size: this.getConvolvedSize()
        };
    }

    public getOutput() {
        return {out: this.out};
    }
}
