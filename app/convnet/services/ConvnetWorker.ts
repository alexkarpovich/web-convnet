import {Convnet} from './Convnet';

let convnet:Convnet = null;

function isNetInit() {
    if (!convnet) {
        self.postMessage({type: 'error', content: 'Convnet is not created yet.'});
    }

    return !!convnet;
}

self.addEventListener('message', event => {
    switch(event.data.type) {
        case 'convnet:init':
            convnet = new Convnet(event.data.content);
            self.postMessage({type: 'convnet', content:'Convnet successfully created'});
            break;
        case 'train:start':
            if (!isNetInit()) return;

            setTimeout(() => convnet.train(event.data.content, () => {
                self.postMessage({type: 'train:done'});
            }),0);
            self.postMessage({type: 'train', content: 'Training is successfully started'});
            break;
        case 'train:stop':
            if (!isNetInit()) return;

            convnet.stopTraining();
            self.postMessage({type: 'train', content: 'Training is successfully stopped'});
            break;
        case 'test':
            if (!isNetInit()) return;

            let result = convnet.test(event.data.content);
            self.postMessage({type: 'test', content: result});
            break;
        case 'net:getState':
            if (!isNetInit()) return;

            self.postMessage({type: 'net:state', content: convnet.getState()});
            break;
    }

});
