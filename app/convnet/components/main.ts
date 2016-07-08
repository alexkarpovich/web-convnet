import {Component, ViewChild} from 'angular2/core'
import {Convnet} from '../services/Convnet';

@Component({
    selector: 'main',
    template: `
    `
})
export class Main {
    @ViewChild('source') source:any;
    @ViewChild('dest') dest:any;

    ngOnInit() {
        let src = new Image();
        src.src = '/images/img64.jpg';
        src.onload = event => this.init(event);
    }

    init(event) {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        let img = event.target;
        context.drawImage(img,0,0);

        let convnet = new Convnet({
            layers: [
                {type:'input', image:context.getImageData(0,0,img.width,img.height)},
                {type:'conv', size:5, count:6, shape:'same', activate: 'sigmoid'},
                {type:'fc', size: 300, activate: 'sigmoid'},
                {type:'output', size: 10, activate: 'sigmoid'}
            ]
        });

        convnet.feadforward();
    }


}
