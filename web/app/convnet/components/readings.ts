import {Component} from 'angular2/core'
import {DataService} from '../services/data.service'

@Component({
    selector: 'convnet-readings',
    template: `
    <div class="convnet-readings">
        Convnet readings
    </div>
    `
})
export class ConvnetReadings {
    constructor(private dataService:DataService) {

    }
}