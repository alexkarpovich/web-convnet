import {Injectable} from 'angular2/core'
import {Layer} from './Layer'

@Injectable()
export class ConvnetService {
    private weights:any;
    private biases:any;
    private layers:any;

    constructor(layers:any) {}
}
