import {Component, Input, ViewChild} from 'angular2/core'

@Component({
    selector: 'layer-view',
    template: `
    <canvas #output width="1000" height="100"></canvas>
    `
})
export class LayerView {
    @Input() layer:any;
    @ViewChild('output', true) output:any;

    ngAfterViewInit() {
        let cnv = this.output.nativeElement;
        let cnx = cnv.getContext('2d');

        this.layer.images && this.layer.images.forEach((imgData, key) => {
            cnx.putImageData(imgData, key*imgData.width+20, 0);
        });
    }
}