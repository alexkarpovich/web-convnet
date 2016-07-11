import {Component, ViewChild} from 'angular2/core'
import {ConvnetService} from '../services/ConvnetService';

@Component({
    selector: 'main',
    template: `
        <canvas #canvas class="convnet-view"></canvas>
        <button id="startTraining" (click)="startTraining()">Start Training</button>
        <button id="stopTraining" (click)="stopTraining()">Stop Training</button>
    `
})
export class Main {
    @ViewChild('canvas') canvas:any;
    private convnetService:ConvnetService;

    constructor() {
        this.convnetService = new ConvnetService({
            size: [64, 64],
            layers: [
                {type:'conv', size:[5,5], count:6, shape:'same', activate: 'sigmoid'},
                {type:'pooling', size: [2,2]},
                {type:'fc', size: [300], activate: 'sigmoid'},
                {type:'output', size: [2], activate: 'sigmoid'}
            ]
        });
    }

    public startTraining() {
        this.preloadImages([
            {path: '/images/cat1.jpg', label:[1,0]},
            {path: '/images/cat2.png', label:[1,0]},
            {path: '/images/cat3.jpg', label:[1,0]},
            {path: '/images/dog1.png', label:[0,1]},
            {path: '/images/dog2.jpg', label:[0,1]},
            {path: '/images/dog3.jpg', label:[0,1]},
        ]);
    }

    stopTraining() {
        this.convnetService.stopTraining();
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
                    this.doTrain(result);
                }
            };
        });
    }

    private doTrain(examples) {
        console.log('Main', examples);

        this.convnetService.train({
            trainingSet: examples,
            learningRate: 0.01,
            maxIterations: 1000,
            minError: 1
        }, () => this.convnetService.test(examples[0].input));
    }


}
