import {Component, ViewChild} from 'angular2/core'
import {Convnet} from '../services/Convnet';

@Component({
    selector: 'main',
    template: `
        <button (click)="run()">Run network</button>
    `
})
export class Main {
    @ViewChild('source') source:any;
    @ViewChild('dest') dest:any;

    run() {
        this.preloadImages([
            {path: '/images/cat1.jpg', label:[1,0]},
            {path: '/images/cat2.png', label:[1,0]},
            {path: '/images/cat3.jpg', label:[1,0]},
            {path: '/images/dog1.png', label:[0,1]},
            {path: '/images/dog2.jpg', label:[0,1]},
            {path: '/images/dog3.jpg', label:[0,1]},
        ]);
    }

    private preloadImages(examples:any[]) {
        let image, loadedCount = 0, result = [];

        examples.forEach(example => {
            image = new Image();
            image.src = example.path;
            image.onload = event => {
                let canvas = document.createElement('canvas');
                let context = canvas.getContext('2d');
                let img = event.target;
                context.drawImage(img,0,0);
                result.push({
                    input:context.getImageData(0,0,img.width,img.height),
                    label:example.label
                });
                loadedCount++;

                if (examples.length == loadedCount) {
                    this.init(result);
                }
            };
        });
    }

    private init(examples) {
        console.log('Main', examples);

        let convnet = new Convnet({
            size: [64, 64],
            layers: [
                {type:'conv', size:[5,5], count:6, shape:'same', activate: 'sigmoid'},
                {type:'pooling', size: [2,2]},
                {type:'fc', size: [300], activate: 'sigmoid'},
                {type:'output', size: [2], activate: 'sigmoid'}
            ]
        });

        convnet.train({
            trainingSet: examples,
            learningRate: 0.01,
            maxIterations: 1000,
            minError: 0.1
        });
    }


}
