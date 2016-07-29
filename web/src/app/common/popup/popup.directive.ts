import {Directive, HostListener, Input, ElementRef} from '@angular/core';
import {PopupComponent} from './popup.component';

@Directive({
    selector: '[popup]'
})
export class PopupDirective {
    @Input() popupComponent: PopupComponent;
    hostElement: HTMLElement;
    isOpen: boolean = false;

    constructor(el: ElementRef) {
        this.hostElement = el.nativeElement;
    }

    toggle() {
        let hostRect = this.hostElement.getBoundingClientRect();
        this.isOpen = !this.isOpen;
        this.popupComponent.offset = {
            left: hostRect.left,
            top: hostRect.top + hostRect.height + 10
        };
        this.popupComponent.visible = this.isOpen;
    }

    @HostListener('click') onClick() {
        this.toggle();
    }
}
