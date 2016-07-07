import {Component, ViewChild} from 'angular2/core'
import {Convnet} from '../services/Convnet';

const IMAGE_SIZE = 512;

@Component({
    selector: 'main',
    template: `
    <span>
    <img #source>
    </span>
    <span>
    <canvas #dest width="512" height="512"></canvas>
    </span>
    `
})
export class Main {
    @ViewChild('source') source:any;
    @ViewChild('dest') dest:any;

    ngOnInit() {
        let src = new Image();
        src.src = '/images/lenna.png';
        src.onload = event => this.init(event);
    }

    init(event) {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        context.drawImage(event.target,0,0);

        let convnet = new Convnet({
            image: context.getImageData(0,0,canvas.width,canvas.height),
            layers: [
                {type:'convolution', kernelSize:5, kernelCount:6, clip:'valid'},
                {type:'downsampling', size:2},
                {type:'fully-connected', size: 300},
                {type:'output', size: 10}
            ]
        });
    }


}
