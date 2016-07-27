import {Component} from 'angular2/core'
import {DataService} from '../services/data.service'
import {IMessage} from "../definitions/convnet";

@Component({
    selector: 'convnet-readings',
    template: `
    <div class="convnet-readings">
        
    </div>
    `,
    directives: []
})
export class ConvnetReadings {
    private chartData:number[];
    private options: Object;

    constructor(private dataService:DataService) {

        this.dataService.stream$.subscribe((msg:IMessage) => {
            switch(msg.type) {
                case 'net:state':
            }
        });
    }
}