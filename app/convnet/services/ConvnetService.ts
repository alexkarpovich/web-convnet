import {IConvnetParams} from './Convnet'
import ConvnetWorker = require('worker!./ConvnetWorker')

export class ConvnetService {
    private convnetWorker:Worker;
    private trainCallback:any;
    private stateCallback:any;

    constructor(params:IConvnetParams) {
        this.convnetWorker = new ConvnetWorker;
        this.convnetWorker.onmessage = this.onMessage.bind(this);
        this.postMessage({
            type:'convnet:init',
            content: params
        })
    }

    private onMessage(event) {
        switch(event.data.type) {
            case 'train:done':
                this.trainCallback && this.trainCallback();
                break;
            case 'net:state':
                this.stateCallback && this.stateCallback(event.data.content);
                break;
        }
    }

    private postMessage(message) {
        this.convnetWorker.postMessage(message);
    }

    public train(params:any, callback) {
        this.convnetWorker.postMessage({
            type: 'train:start',
            content: params
        });
        this.trainCallback = callback;
    }

    public test(image:any) {
        console.log("test");
        this.convnetWorker.postMessage({
            type: 'test',
            content: image
        });
    }

    public stopTraining() {
        this.convnetWorker.postMessage({
            type: 'train:stop',
            content:''
        });
    }

    public getState(callback) {
        this.convnetWorker.postMessage({
            type: 'net:getState'
        });
        this.stateCallback = callback;
    }
}