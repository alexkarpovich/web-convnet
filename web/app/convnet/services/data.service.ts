import {Injectable} from 'angular2/core'
import {$WebSocket} from 'angular2-websocket/angular2-websocket'
import {Observable, Observer, Subject} from "rxjs/Rx";
import {ITrainParams, IMessage} from '../definitions/convnet'

@Injectable()
export class DataService {
    private _ws:$WebSocket;
    private _stream$:Observable<any>;
    private _observer:Observer<IMessage>;
    private _editing$:Subject<any> = new Subject();
    private _isEditing:boolean = false;
    private _config:any;

    constructor() {
        this._stream$ = new Observable(observer => this._observer=observer);
        this._ws = new $WebSocket("ws://localhost:7777/");
        this._ws.getDataStream().subscribe((event:any)=> {
            let msg = JSON.parse(event.data);
            this._observer.next(msg);
        });
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

    public train(trainPrams:ITrainParams) {
        this._ws.send({type: "net:startTraining", data: trainPrams});
    }

    public stopTraining() {
        this._ws.send({type: "net:stopTraining"});
    }

    public save() {
        this._ws.send({type: "net:saveWeights"});
    }
}