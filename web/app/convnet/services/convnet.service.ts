import {Injectable} from 'angular2/core'
import {Subject} from 'rxjs/Subject'
import {$WebSocket} from 'angular2-websocket/angular2-websocket'

@Injectable()
export class ConvnetService {
    private _ws:$WebSocket;
    private _editing$:Subject<boolean> = new Subject();
    private _isEditing:boolean = false;
    private _config:any;

    constructor() {
        this._ws = new $WebSocket("ws://localhost:7777/");
        this._ws.getDataStream().subscribe(val => console.log(val));
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
        return this._ws.getDataStream();
    }

    public setupNetwork(params:any) {
        this._ws.send({
            type: 'net:setup',
            data: params
        });
    }

    public getNetConfig() {
        this._ws.send({
            type: "net:config"
        });
    }
}