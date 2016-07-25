import {Component, ViewChild, AfterViewInit} from 'angular2/core'
import {NgFor, NgIf} from 'angular2/common'
import {DataService} from '../services/data.service'

let FC_SIZE = 5,
    OUT_SIZE = 15,
    VSTEP = 5,
    HSTEP = 2;

@Component({
    selector: 'convnet-view',
    template: `
    <div class="convnet-view">
        <canvas #cnview [width]="width" [height]="height"></canvas>
    </div>
    `,
    directives: [NgFor, NgIf]
})
export class ConvnetView implements AfterViewInit {
    @ViewChild('cnview') cnview:any;
    private width:number = 400;
    private height:number = 400;
    private _ctx:CanvasRenderingContext2D;
    private _config:any;
    private vpos:number = 0;

    constructor(private dataService:DataService) {
        this.dataService.stream$.subscribe(msg => {
            switch(msg.type) {
                case "net:config": this._config = msg.data; break;
                case "net:state": this.state = msg.data; break;
            }
        });
    }

    ngAfterViewInit() {
        let canvas = this.cnview.nativeElement;
        this._ctx = canvas.getContext('2d');
    }

    set state(data:any) {
        this.vpos = VSTEP;
        this._ctx.clearRect(0,0,this.width,this.height);
        let inImgData = this._ctx.createImageData(data.size[0], data.size[1]);
        for (let i=0; i<data.in.length;i++) {
            let j = i*4;
            inImgData.data[j]=inImgData.data[j+1]=inImgData.data[j+2] = data.in[i];
            inImgData.data[j+3] = 255;
        }
        this._ctx.putImageData(inImgData,(this.width-data.size[0])/2,this.vpos);
        this.vpos += data.size[1] + VSTEP;

        data.layers.forEach((layer:any) => {
            switch(layer.type) {
                case "conv": return this.processConvLayer(layer);
                case "pool": return this.processPoolLayer(layer);
                case "fc": return this.processFCLayer(layer);
                case "output": return this.processOutputLayer(layer);
            }
        });
    }

    processConvLayer(layer:any) {
        let count = layer.inCount * layer.count;
        let bw = count*(layer.outSize[0]+HSTEP)-HSTEP;
        let startx = (this.width-bw)/2;
        let step = (layer.outSize[0]+HSTEP);
        for (let k=0; k<layer.inCount * layer.count; k++) {
            let imData = this._ctx.createImageData(layer.outSize[0], layer.outSize[1]);
            let offset = k * layer.outSize[0] * layer.outSize[1];

            for (let i=0; i<layer.out.length; i++) {
                let j = i*4;
                imData.data[j] = imData.data[j+1] = imData.data[j+2] = layer.out[i+offset] * 255;
                imData.data[j+3] = 255;
            }

            this._ctx.putImageData(imData, startx+k*step, this.vpos);
        }

        this.vpos += layer.outSize[1]+VSTEP;
    }

    processPoolLayer(layer:any) {
        let bw = layer.count*(layer.outSize[0]+HSTEP)-HSTEP;
        let startx = (this.width-bw)/2;
        let step = (layer.outSize[0]+HSTEP);
        for (let k=0; k<layer.count; k++) {
            let imData = this._ctx.createImageData(layer.outSize[0], layer.outSize[1]);
            let offset = k * layer.outSize[0] * layer.outSize[1];

            for (let i=0; i<layer.out.length; i++) {
                let j = i*4;
                imData.data[j] = imData.data[j+1] = imData.data[j+2] = layer.out[i+offset] * 255;
                imData.data[j+3] = 255;
            }

            this._ctx.putImageData(imData, startx+k*step, this.vpos);
        }
        this.vpos += layer.outSize[1]+VSTEP;
    }

    processFCLayer(layer:any) {
        let lineCount = Math.floor(this.width/(FC_SIZE+1));
        let preSize = layer.out.length*(FC_SIZE+1)-1;
        let blockHeight = Math.ceil(preSize/lineCount);
        let xoffset = lineCount < layer.out.length ? 0 : (this.width-preSize)/2;

        let j = 0, k = 0, s=8;
        for (let i=0; i<layer.out.length; i++, j++) {
            if (j >= lineCount) {
                j=0;
                k++;
            }
            let x = j*(FC_SIZE+1)+xoffset, c = Math.floor(layer.out[i] * 255);
            this._ctx.fillStyle = `rgb(${c},${c},${c})`;
            this._ctx.fillRect(x, this.vpos+k*(FC_SIZE+1), FC_SIZE, FC_SIZE);
        }

        this.vpos += blockHeight + VSTEP;
    }

    processOutputLayer(layer:any) {
        let lineCount = Math.floor(this.width/(OUT_SIZE+1));
        let blockHeight = Math.ceil(layer.out.length*OUT_SIZE/lineCount);
        let xoffset = lineCount < layer.out.length ? 0 : (this.width-layer.out.length*(OUT_SIZE+1)-1)/2;

        let j = 0, k = 0, s=8;
        for (let i=0; i<layer.out.length; i++, j++) {
            if (j >= lineCount) {
                j=0;
                k++;
            }
            let x = j*(OUT_SIZE+1)+xoffset, c = Math.floor(layer.out[i] * 255);
            this._ctx.fillStyle = `rgb(${c},${c},${c})`;
            this._ctx.fillRect(x, this.vpos+k*(OUT_SIZE+1), OUT_SIZE, OUT_SIZE);
        }

        this.vpos += blockHeight + VSTEP;
    }
}