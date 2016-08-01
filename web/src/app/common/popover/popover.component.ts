import {Component, Input, ViewChild, ViewContainerRef, ElementRef} from '@angular/core';
import {NgClass, NgStyle} from '@angular/common';

@Component({
    selector: 'popover',
    template: `
    <div
        [ngClass]="{popover: true, open: isVisible}"
        [ngStyle]="_style">
        <div class="content">
            <ng-content></ng-content>
        </div>
    </div>
    `,
    directives: [NgClass, NgStyle]
})
export class PopoverComponent {
    @Input() width: number;
    @Input() height: number;
    @ViewChild('content') contentRef: ElementRef;
    private isVisible: boolean = false;
    private _style: any = {
        left: 0,
        top: 0,
        width: this.width + 'px',
        height: this.height + 'px'
    };

    ngOnInit() {
        this._style.width = this.width + 'px';
        this._style.height = this.height + 'px';
    }

    ngAfterContentInit() {
        console.log(this.contentRef);
    }

    set visible(isVisible) {
        this.isVisible = isVisible;
    }

    set offset(hostRect) {
        this._style.left = hostRect.left - (this.width - hostRect.width) / 2 + 'px';
        this._style.top = hostRect.bottom + 10 + 'px';
    }
}
