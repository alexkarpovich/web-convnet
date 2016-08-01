import {Directive, HostListener, Input, ElementRef} from '@angular/core';
import {PopoverComponent} from './popover.component';

@Directive({
    selector: '[popover]'
})
export class PopoverDirective {
    @Input() popover: PopoverComponent;
    hostElement: HTMLElement;
    isOpen: boolean = false;

    @HostListener('click') onClick() {
        this.toggle();
        this.updateComponent();
    }

    @HostListener('window:resize') onResize() {
        this.updateComponent();
    }

    constructor(el: ElementRef) {
        this.hostElement = el.nativeElement;
    }

    toggle() {
        this.isOpen = !this.isOpen;
    }

    updateComponent() {
        let hostRect = this.hostElement.getBoundingClientRect();
        this.popover.offset = hostRect;
        this.popover.visible = this.isOpen;
    }


}
