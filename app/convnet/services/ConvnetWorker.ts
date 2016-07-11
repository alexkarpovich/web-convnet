import {Convnet} from './Convnet';

let convnet:Convnet = null;
let trainProcId = null;

self.addEventListener('message', event => {
    console.log(event);
    switch(event.data.type) {
        case 'convnet:init':
            convnet = new Convnet(event.data.content);
            self.postMessage({type: 'convnet', content:'Convnet successfully created'});
            break;
        case 'train:start':
            if (convnet) {
                trainProcId = setTimeout(() => convnet.train(event.data.content, () => {
                    self.postMessage({type: 'train:done'});
                }),0);
                self.postMessage({type: 'train', content: 'Training is successfully started'});
            } else {
                self.postMessage({type: 'train', content: 'Convnet is not created yet.'});
            }
            break;
        case 'train:stop':
            if(trainProcId) {
                clearTimeout(trainProcId);
                self.postMessage({type: 'train', content: 'Training is successfully stopped'});
            } else {
                self.postMessage({type: 'train', content: 'Convnet is not being trained yet.'});
            }
            break;
        case 'test':
            if (convnet) {
                let result = convnet.test(event.data.content);
                self.postMessage({type: 'test', content: result});
            } else {
                self.postMessage({type: 'test', content: 'Convnet is not created yet.'});
            }
    }

});
