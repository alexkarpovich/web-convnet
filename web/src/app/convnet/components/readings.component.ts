import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../services/data.service';
import {IMessage} from '../convnet.d';

declare var Chart: any;
const COUNT = 25;

@Component({
    selector: 'convnet-readings',
    template: `
    <div class="readings">
        <canvas #chart width="400" height="250"></canvas>
    </div>
    `,
    styleUrls: ['./readings.component.scss']
})
export class ReadingsComponent implements OnInit {
    @ViewChild('chart') chartCanvas: any;
    private chart: any;
    private chartData: any = {
        allLabels: [],
        allData: [],
        labels: [],
        data: []
    };

    constructor(private dataService: DataService) {
        this.dataService.stream$.subscribe((msg: IMessage) => {
            switch (msg.type) {
                case 'net:state':
                    setTimeout(() => this.addChartData(msg.data.iteration, msg.data.error), 0);
                    break;
            }
        });
    }

    addChartData(label, data) {
        this.chartData.allLabels.push(label);
        this.chartData.allData.push(data);

        let lng = this.chartData.allLabels.length;

        if (lng < 2 * COUNT) {
            this.chartData.data = this.chartData.allData;
            this.chartData.labels = this.chartData.allLabels;
        } else {
            this.chartData.labels = [];
            this.chartData.data = [];
            let step = Math.ceil(lng / COUNT);

            for (let i = 0; i < lng; i += step) {
                this.chartData.labels.push(this.chartData.allLabels[i]);
                this.chartData.data.push(this.chartData.allData[i]);
            }
        }

        this.chart.data.labels = this.chartData.labels;
        this.chart.data.datasets[0].data = this.chartData.data;
        this.chart.update();
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
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    pointRadius: 0
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
