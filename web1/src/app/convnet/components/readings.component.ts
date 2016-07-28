import {Component} from '@angular/core';
import {DataService} from '../services/data.service';
import {IMessage} from '../convnet.d';

@Component({
    selector: 'convnet-readings',
    template: `
    <div class="convnet-readings">
    </div>
    `
})
export class ConvnetReadingsComponent {
    constructor(private dataService: DataService) {

        this.dataService.stream$.subscribe((msg: IMessage) => {
            switch (msg.type) {
                case 'net:state':
            }
        });
    }
}
