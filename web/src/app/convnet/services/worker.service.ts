import {Injectable} from '@angular/core';
import ConvnetWorker = require('worker?name=convnet!../../workers/convnet.worker');

@Injectable()
export class WorkerService {
    private worker: Worker;

    constructor() {
        this.worker = new ConvnetWorker;

        this.worker.postMessage({type: 'init', data: 'hello'});
    }

    prepareImageData(data: any) {
        this.worker.postMessage({type: 'prepare_image_data', data: data});
    }
}
