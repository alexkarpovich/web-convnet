import {NetView} from './convnet.worker/net-view';

self.addEventListener('message', (event: any) => {
    let message = event.data;

    switch (message.type) {
        case 'view:image':
            let netView = new NetView(message.data);
            let distImageData = netView.prepareImageData();
            self.postMessage({type: 'view:image', data: distImageData});
            break;
    }
});

