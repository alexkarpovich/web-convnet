import {Component} from 'angular2/core'
import {ConvnetContainer} from './convnet-container'
import {ConvnetConfig} from './convnet-config'
import {ConvnetService} from "../services/convnet.service";

@Component({
    selector: 'convnet',
    template: `
        <div class="convnet">
            <convnet-container></convnet-container>
            <convnet-config></convnet-config>
        </div>
    `,
    directives: [ConvnetContainer, ConvnetConfig],
    providers: [ConvnetService]
})
export class Convnet {
    constructor() {

    }
}