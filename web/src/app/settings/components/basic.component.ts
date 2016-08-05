import {Component} from '@angular/core';
import {NotificationService} from '../services/notification.service';

@Component({
    selector: 'basic-settings',
    template: `
    <div class="basic-settings">
        Basic settings
    </div>
    `,
    providers: [NotificationService]
})
export class BasicComponent {
    constructor(private notificationService: NotificationService) {}
}
