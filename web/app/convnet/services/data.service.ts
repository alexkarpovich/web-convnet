import {Injectable} from 'angular2/core'
import {$WebSocket} from 'angular2-websocket/angular2-websocket'
import {Observable, Observer, Subject} from "rxjs/Rx";
import {ITrainParams, IMessage} from '../definitions/convnet'

@Injectable()
export class DataService {
    private _ws:$WebSocket;
    private _stream$:Observable<any>;
    private _editing$:Subject<any> = new Subject();
    private _isEditing:boolean = false;
    private _config:any;

    constructor() {
        this._ws = new $WebSocket("ws://localhost:7777/");
        let wsstream$ = this._ws.getDataStream();
        this._stream$ = Observable.create(observer => {
            wsstream$.subscribe((event:any)=> {
                let msg = JSON.parse(event.data);
                observer.next(msg);
            });
        });

        this._ws.onClose(()=>setTimeout(()=>this._ws.reconnect(), 5000));
        this._ws.connect();
    }

    get isEditing() {
        return this._isEditing;
    }

    get editing$() {
        return this._editing$;
    }

    get config() {
        return this._config
    }

    set config(newConfig) {
        this._config = newConfig
    }

    set isEditing(isEdit) {
        this._isEditing = isEdit;
        this._editing$.next(isEdit);
    }

    get stream$() {
        return this._stream$;
    }

    public onopen(callback) {
        this._ws.onOpen(callback);
    }

    public setupNetwork(params:any) {
        this._ws.send({type: 'net:setup', data: params});
    }

    public getNetConfig() {
        this._ws.send({type: "net:config"});
    }

    public startTraining(trainPrams:ITrainParams) {
        this._ws.send({type: "training:start", data: trainPrams});
    }

    public stopTraining() {
        this._ws.send({type: "training:stop"});
    }

    public trainingState() {
        this._ws.send({type: "training:state"});
    }

    public save() {
        this._ws.send({type: "net:saveWeights"});
    }
}