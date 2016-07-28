import {Injectable} from '@angular/core';
import {$WebSocket} from 'angular2-websocket/angular2-websocket';
import {Subject} from 'rxjs/Subject';
import {ITrainParams} from '../convnet.d';

@Injectable()
export class DataService {
    private _ws: $WebSocket;
    private _editing$: Subject<any> = new Subject();
    private _isEditing: boolean = false;
    private _config: any;

    constructor() {
        this._ws = new $WebSocket('ws://localhost:7777/');
        this._ws.onClose(() => setTimeout(() => this.reconnect(), 5000));
        this._ws.connect();
    }

    get isEditing() {
        return this._isEditing;
    }

    get editing$() {
        return this._editing$;
    }

    get config() {
        return this._config;
    }

    set config(newConfig: any) {
        this._config = newConfig;
    }

    set isEditing(isEdit: boolean) {
        this._isEditing = isEdit;
        this._editing$.next(isEdit);
    }

    get stream$() {
        return this._ws.getDataStream().map((event: any) => JSON.parse(event.data));
    }

    public onopen(callback: any) {
        this._ws.onOpen(callback);
    }

    public reconnect() {
        this._ws.reconnect();
        this.trainingState();
    }

    public setupNetwork(params: any) {
        this._ws.send({type: 'net:setup', data: params});
    }

    public getNetConfig() {
        this._ws.send({type: 'net:config'});
    }

    public startTraining(trainPrams: ITrainParams) {
        this._ws.send({type: 'training:start', data: trainPrams});
    }

    public stopTraining() {
        this._ws.send({type: 'training:stop'});
    }

    public trainingState() {
        this._ws.send({type: 'training:state'});
    }

    public save() {
        this._ws.send({type: 'net:saveWeights'});
    }
}
