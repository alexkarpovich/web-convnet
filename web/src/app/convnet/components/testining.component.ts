import {Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import {DataService} from '../services/data.service';
import {TestingService} from '../services/testing.service';
import {IMessage} from '../convnet';

@Component({
    selector: 'testing',
    template: `
    <div class="testing">
        <canvas #board width="28" height="28"></canvas>
        <div class="controls">
            <button type="button" (click)="test()">Test</button>
            <button type="button" (click)="clear()">Clear</button>
        </div>
    </div>
    `,
    styleUrls: ['./testing.component.scss'],
    providers: [TestingService]
})
export class TestingComponent implements OnInit {
    @ViewChild('board') board: ElementRef;
    private context: CanvasRenderingContext2D;
    private isDown: boolean = false;

    constructor(
        private dataService: DataService,
        private testingService: TestingService) {

        this.dataService.stream$.subscribe((msg: IMessage) => {
            switch (msg.type) {
                case 'net:test': console.log(msg.data); break;
            }
        });
    }

    ngOnInit() {
        let canvas = this.board.nativeElement;
        this.context = canvas.getContext('2d');

        canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        canvas.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    }

    test() {
        let rawImage = this.testingService.convertToRaw(this.context);
        this.dataService.test(rawImage);
    }

    clear() {
        this.testingService.clear();
        this.redraw();
    }

    redraw() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.strokeStyle = "#ffffff";
        this.context.lineJoin = "round";
        this.context.lineWidth = 2;

        let points = this.testingService.points;
        let dragging = this.testingService.dragging;

        for(let i = 0; i < points.length; i++) {
            this.context.beginPath();

            if (dragging[i] && i){
                this.context.moveTo(points[i - 1].x, points[i - 1].y);
            } else {
                this.context.moveTo(points[i].x - 1, points[i].y);
            }

            this.context.lineTo(points[i].x , points[i].y);
            this.context.closePath();
            this.context.stroke();
        }
    }

    onMouseDown(e) {
        this.isDown = true;

        this.testingService.addPoint(e.offsetX, e.offsetY, false);
        this.redraw();

    }

    onMouseMove(e) {
        if (this.isDown) {
            this.testingService.addPoint(e.offsetX, e.offsetY, true);
            this.redraw();
        }
    }

    onMouseUp(e) {
        this.isDown = false;
    }

    onMouseLeave(e) {
        this.isDown = false;
    }
}
