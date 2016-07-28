import {Injectable} from '@angular/core'
import {$WebSocket} from 'angular2-websocket/angular2-websocket'
import {Subject} from 'rxjs/Subject'
import {Observable} from 'rxjs/Observable'
import {map} from 'rxjs/operator/map'
import {ITrainParams, IMessage} from '../definitions/convnet'
import 'rxjs/add/operator/map'

@Injectable()
export class DataService {
    private _ws:$WebSocket;
    private _stream$: Observable<IMessage>;
    private _editing$:Subject<any> = new Subject();
    private _isEditing:boolean = false;
    private _config:any;

    constructor() {
        this._ws = new $WebSocket("ws://localhost:7777/");
        let wsstream$ = this._ws.getDataStream();
        this._stream$ = Observable.create((observer:any) => {
            wsstream$.subscribe((event:any)=> {
                let msg = JSON.parse(event.data);
                observer.next(msg);
            });
        });

        this._ws.onClose(()=>setTimeout(()=>this.reconnect(), 5000));
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

    public onopen(callback:any) {
        this._ws.onOpen(callback);
    }

    public reconnect() {
        this._ws.reconnect();
        this.trainingState();
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