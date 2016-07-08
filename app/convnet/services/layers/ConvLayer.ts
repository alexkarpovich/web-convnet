import {Layer} from '../Layer'
import {Utils} from '../utils'

export enum ConvShape {
    VALID, SAME, FULL
}

export class ConvLayer extends Layer {
    private inWidth:number;
    private inHeight:number;
    private shape:ConvShape;
    private subsample:number[];
    private K:number[][];
    private in:number[];
    private convOut:number[][];
    private out:number[][];
    private count:number;

    constructor(params:any) {
        super(params);
        this.in = [];
        this.convOut = [];
        this.out = [];
        this.shape = this.getShapeFromString(params.shape);
        this.subsample = params.subsample;
        this.count = params.count;
        this.init();
    }

    private init():void {
        this.K = [];
        let kernelSize = Math.pow(this.size, 2);

        for (let i=0;i<this.count;i++) {
            this.K[i] = [];
            for (let j=0; j<kernelSize; j++) {
                this.K[i][j] = Utils.getRandom(-1, 1);
            }
        }

        this.prepareInput();
    }

    private prepareInput():void {
        switch(this.shape) {
            case ConvShape.VALID:
                this.convertToValid();
                break;
            case ConvShape.SAME:
                this.convertToSame();
                break;
            case ConvShape.FULL:
            default:
                this.convertToFull();
        }
    }

    private convertToValid():void {
        let img = this.prev.getImage();

        this.in = this.prev.getOut();
        this.inWidth = img.width;
        this.inHeight = img.height;

    }

    private convertToSame() {
        let img = this.prev.getImage();
        let out = this.prev.getOut();
        let fPad, sPad, result = [];
        let isEven = this.size%2==0;
        if(isEven) {
            fPad = ~~(this.size/2);
            sPad = ~~(fPad / 2);
        } else {
            fPad = sPad = ~~(this.size/2);
        }

        this.inWidth = img.width+fPad+sPad;
        this.inHeight = img.height+fPad+sPad;

        console.log('Same:', this.inWidth, this.inHeight);

        for (let i=0; i<this.inWidth; i++) {
            for (let j=0; j<this.inHeight; j++) {
                if(i<fPad || i>img.width+fPad-1 || j<fPad || j>img.height+fPad-1) {
                    result[i+this.inWidth*j] = 0;
                } else {
                    result[i+this.inWidth*j] = out[i-fPad+img.width*(j-fPad)];
                }
            }
        }

        this.in = result;
    }

    private convertToFull() {
        let img = this.prev.getImage();
        let out = this.prev.getOut();
        let pad = this.size-1,
            result = [];

        this.inWidth = img.width+2*pad;
        this.inHeight = img.height+2*pad;

        console.log('Full:', this.inWidth, this.inHeight);

        for (let i=0; i<this.inWidth; i++) {
            for (let j=0; j<this.inHeight; j++) {
                if(i<pad || i>img.width+pad-1 || j<pad || j>img.height+pad-1) {
                    result[i+this.inWidth*j] = 0;
                } else {
                    result[i+this.inWidth*j] = out[i-pad+img.width*(j-pad)];
                }
            }
        }

        this.in = result;
    }

    private conv(kernel:number[]):number[] {
        let result = [];
        let p = 0;
        let xRange = this.inWidth-this.size;
        let yRange = this.inHeight-this.size;

        for (let i=0; i<=xRange; i++) {
            for (let j=0; j<=yRange; j++) {
                let v = 0;

                for (let k=0; k<this.size; k++) {
                    for (let t=0; t<this.size; t++) {
                        v += this.in[i+this.inWidth*j+k+t*this.inWidth] * kernel[k+this.size*t];
                    }
                }

                result[p++] = Utils.sigmoid(v);
            }
        }

        return result;
    }

    private downsample(convolved:number[]):number[] {
        let result = [];
        let p = 0;
        let size = this.getConvolvedSize();

        for (let i=0; i<size[0]; i+=this.subsample[0]) {
            for (let j=0; j<size[1]; j+=this.subsample[1]) {
                let v = [];

                for (let k=0; k<this.subsample[0]; k++) {
                    for (let t=0; t<this.subsample[1]; t++) {
                        v.push(this.in[i+size[0]*j+k+t*size[0]]);
                    }
                }

                result[p++] = Math.max.apply(null, v);
            }
        }

        return result;
    }

    public feadforward() {
        let j = 0;

        for (let i=0; i<this.count; i++) {
            let convolved = this.conv(this.K[i]);
            this.convOut[j] = convolved;
            this.out[j] = this.downsample(convolved);
            j++;
        }
    }

    public backprop() {

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
        let img = this.prev.getImage();

        switch(this.shape) {
            case ConvShape.VALID:
                return [img.width-this.size+1, img.height-this.size+1];
            case ConvShape.SAME:
                return [img.width, img.height];
            case ConvShape.FULL:
            default:
                return [img.width+this.size-1, img.height+this.size-1];
        }
    }
}
