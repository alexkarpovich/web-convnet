import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../services/data.service';
import {IMessage} from '../convnet.d';

declare var Chart: any;

@Component({
    selector: 'convnet-readings',
    template: `
    <div class="readings">
        <canvas #chart width="400" height="400"></canvas>
    </div>
    `,
    styleUrls: ['./readings.component.scss']
})
export class ReadingsComponent implements OnInit {
    @ViewChild('chart') chartCanvas: any;
    private chart: any;

    constructor(private dataService: DataService) {
        this.dataService.stream$.subscribe((msg: IMessage) => {
            switch (msg.type) {
                case 'net:state':
                    if (this.chart) {
                        this.chart.data.labels.push(msg.data.iteration);
                        this.chart.data.datasets[0].data.push(msg.data.error);
                        this.chart.update();
                    }
                    break;
            }
        });
    }

    ngOnInit() {
        let ctx = this.chartCanvas.nativeElement;

        this.chart = new Chart.Line(ctx, {
            data: {
                labels: [],
                datasets: [{
                    label: 'Network error',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)'
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        }
                    }]
                }
            }
        });
    }

}
