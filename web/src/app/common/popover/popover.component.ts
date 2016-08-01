import {Component, Input, AfterViewChecked, ElementRef} from '@angular/core';
import {NgClass, NgStyle} from '@angular/common';

interface IOffset {
    left: number;
    top: number;
}

@Component({
    selector: 'popover',
    template: `
    <div 
        [ngClass]="{popover: true, open: isVisible}" 
        [ngStyle]="{'left': _offset.left+'px', 'top': _offset.top+'px'}">
        <ng-content></ng-content>
    </div>
    `,
    directives: [NgClass, NgStyle]
})
export class PopoverComponent {
    private isVisible: boolean = false;
    private _offset: IOffset = {
        left: 0,
        top: 0
    };

    constructor(private el: ElementRef) {}

    set visible(isVisible) {
        this.isVisible = isVisible;
    }

    set offset(hostRect) {
        let selfElement = this.el.nativeElement;
        let root = selfElement.querySelector('div');
        let selfRect = root.getBoundingClientRect();

        this._offset = {
            left: hostRect.left - (selfRect.width - hostRect.width) / 2,
            top: hostRect.bottom + 10
        };
    }
}
