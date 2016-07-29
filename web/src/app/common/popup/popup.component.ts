import {Component, ElementRef} from '@angular/core';
import {NgClass, NgStyle} from '@angular/common';

interface IOffset {
    left: number
    top: number
}

@Component({
    selector: 'popup',
    template: `
    <div [ngClass]="{popup: true, open: isVisible}" [ngStyle]="{'left': _offset.left+'px', 'top': _offset.top+'px'}">
        <div class="popup-heading">
            <ng-content select="header"></ng-content>
        </div>
        <div class="popup-body">
            <ng-content select="content"></ng-content>
        </div>
        <div class="popup-footer">
            <ng-content select="footer"></ng-content>
        </div>
    </div>
    `,
    directives: [NgClass]
})
export class PopupComponent {
    private isVisible: boolean = false;
    private _offset: IOffset = {
        left: 0,
        top: 0
    };

    constructor() {}

    set visible(isVisible) {
        this.isVisible = isVisible;
    }

    set offset(offset) {
        this._offset = offset;
    }
}
