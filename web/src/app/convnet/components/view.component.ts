import {Component, ViewChild, OnInit} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import {DataService} from '../services/data.service';
import {WorkerService} from '../services/worker.service';
import {IMessage} from '../convnet.d';

let FC_SIZE = 5,
    OUT_SIZE = 15,
    VSTEP = 5,
    HSTEP = 2;

@Component({
    selector: 'convnet-view',
    template: `
    <div class="view">
        <canvas #cnview [width]="width" [height]="height"></canvas>
    </div>
    `,
    directives: [NgFor, NgIf],
    styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
    @ViewChild('cnview') cnview: any;
    private width: number = 400;
    private height: number = 400;
    private _ctx: CanvasRenderingContext2D;
    private _config: any;
    private vpos: number = 0;

    constructor(private dataService: DataService, private workerService: WorkerService) {
        this.dataService.stream$.subscribe((msg: IMessage) => {
            switch (msg.type) {
                case 'net:config': this._config = msg.data; break;
                case 'net:state': this.state = msg.data; break;
            }
        });
    }

    ngOnInit() {
        let canvas = this.cnview.nativeElement;
        this._ctx = canvas.getContext('2d');
    }

    set state(data: any) {
        this.workerService.prepareImageData(data);
    }
}
