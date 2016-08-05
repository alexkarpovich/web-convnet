import {Injectable} from '@angular/core';
import TestServiceWorker = require('serviceworker?name=test.service!../../workers/test.serviceworker');

declare var ServiceWorkerRegistration;
declare var Notification;

@Injectable()
export class NotificationService {
    private isPushEnabled: boolean;

    constructor() {
        if ('serviceWorker' in navigator) {
            TestServiceWorker({scope: '/'}).then(this.init.bind(this));
        }
    }

    init() {
        Notification.requestPermission().then(() => {
            if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
                console.warn('Notifications aren\'t supported.');
                return;
            }

            // Check the current Notification permission.
            // If its denied, it's a permanent block until the
            // user changes the permission
            if (Notification.permission === 'denied') {
                console.warn('The user has blocked notifications.');
                return;
            }

            // Check if push messaging is supported
            if (!('PushManager' in window)) {
                console.warn('Push messaging isn\'t supported.');
                return;
            }

            // We need the service worker registration to check for a subscription
            navigator.serviceWorker.ready.then((serviceWorkerRegistration: any) => {
                // Do we already have a push message subscription?
                serviceWorkerRegistration.pushManager.getSubscription()
                    .then((subscription: any) => {
                        if (!subscription) {
                            // We aren't subscribed to push, so set UI
                            // to allow the user to enable push
                            return;
                        }

                        // Keep your server in sync with the latest subscriptionId
                        //sendSubscriptionToServer(subscription);

                        this.isPushEnabled = true;
                    })
                    .catch(function(err) {
                        console.warn('Error during getSubscription()', err);
                    });
            });
        });
    }
}
