import {Component} from 'angular2/core'
import {ConvnetService} from '../services/convnet.service'

@Component({
    selector: 'convnet-view',
    template: `
        Convnet View
    `
})
export class ConvnetView {
    constructor(private convnetService:ConvnetService) {}
}