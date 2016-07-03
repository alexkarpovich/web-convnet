import {Component, ViewChild} from 'angular2/core'

const K = [0,-1,0,-1,4,-1,0,-1,0];
//const K = [0.111,0.111,0.111,0.111,0.111,0.111,0.111,0.111,0.111];
const IMAGE_SIZE = 512;

@Component({
    selector: 'convnet',
    template: `
    <span>
    <img #source>
    </span>
    <span>
    <canvas #dest width="512" height="512"></canvas>
    </span>
    `
})
export class Convnet {
    @ViewChild('source') source:any;
    @ViewChild('dest') dest:any;

    ngOnInit() {
        let src = new Image();
        src.src = '/images/lenna.png';
        src.onload = event => this.initialization(event);
    }

    initialization(event) {
        let src = this.source.nativeElement;
        src.src = event.target.src;
        let dst = this.dest.nativeElement;
        let ctx = dst.getContext('2d');
        ctx.drawImage(src,0,0);
        let srcData = ctx.getImageData(0,0,src.width,src.height);
        let dstData = ctx.createImageData(IMAGE_SIZE, IMAGE_SIZE);
        let grayscaleData = this.img2gray(srcData);

        for (let i=0;i<grayscaleData.data.length;i+=4) {
            let d = grayscaleData.data;

            dstData.data[i] = dstData.data[i+1] =
                dstData.data[i+2] = this.computeKernel(d, i);
            dstData.data[i+3] = 255;
        }
        ctx.clearRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);
        ctx.putImageData(dstData,0,0);
    }

    img2gray(srcData) {
        let grayscaleData = srcData;
        let d = srcData.data;

        for (let i=0;i<srcData.data.length;i+=4) {
            grayscaleData.data[i] = grayscaleData.data[i+1] =
                grayscaleData.data[i+2] = 0.2989*d[i] + 0.5870*d[i+1] + 0.1140*d[i+2];
        }

        return grayscaleData;
    }

    computeKernel(d, i) {
        let shift = IMAGE_SIZE*4;
        return d[i]*K[0]+d[i+4]*K[1]+d[i+8]*K[2]+
            d[i+shift]*K[3]+d[i+shift+4]*K[4]+d[i+shift+8]*K[5]+
            d[i+2*shift]*K[6]+d[i+2*shift+4]*K[7]+d[i+2*shift+8]*K[8];
    }
}
