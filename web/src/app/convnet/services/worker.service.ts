import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import ConvnetWorker = require('worker?name=convnet!../../workers/convnet.worker');

@Injectable()
export class WorkerService {
    private worker: Worker;
    private _stream$: Observable<any>;

    constructor() {
        this.worker = new ConvnetWorker;
        this._stream$ = Observable.fromEvent(this.worker, 'message');
    }

    prepareImageData(data: any) {
        this.worker.postMessage({type: 'view:image', data: data});
    }

    get stream$() {
        return this._stream$.map((event: any) => event.data);
    }
}
