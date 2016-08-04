const FC_SIZE = 5,
    OUT_SIZE = 15,
    VSTEP = 5,
    HSTEP = 2;

export class NetView {
    private vpos: number = VSTEP;
    private width: number = 400;
    private height: number = 400;
    private dist: ImageData;

    constructor(private data: any) {
        this.dist = NetView.createImageData(this.width, this.height);
    }

    static putImageData(destImageData, srcImageData, dx, dy, dirtyX = undefined, dirtyY = undefined, dirtyWidth = undefined, dirtyHeight = undefined) {
        let data = srcImageData.data;
        let height = srcImageData.height;
        let width = srcImageData.width;
        let destWidth = destImageData.width;

        dirtyX = dirtyX || 0;
        dirtyY = dirtyY || 0;
        dirtyWidth = dirtyWidth !== undefined? dirtyWidth: width;
        dirtyHeight = dirtyHeight !== undefined? dirtyHeight: height;

        let limitBottom = dirtyY + dirtyHeight;
        let limitRight = dirtyX + dirtyWidth;

        for (let y = dirtyY; y < limitBottom; y++) {
            for (let x = dirtyX; x < limitRight; x++) {
                let pos = y * width + x;
                let destPos = (y + dy) * destWidth + (x + dx);

                destImageData.data[destPos * 4] = data[pos * 4];
                destImageData.data[destPos * 4 + 1] = data[pos * 4 + 1];
                destImageData.data[destPos * 4 + 2] = data[pos * 4 + 2];
                destImageData.data[destPos * 4 + 3] = data[pos * 4 + 3];
            }
        }
    }

    static createImageData(width, height): ImageData {
        return new ImageData(width, height);
    }

    static fillRect(dist, x, y, width, height, color) {
        let offset = 4 * (x + dist.width * y);
        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                let idx = 4 * (i + dist.width * j) + offset;
                dist.data[idx] = dist.data[idx + 1] = dist.data[idx + 2] = color;
            }
        }
    }

    prepareImageData() {
        let inImgData = NetView.createImageData(this.data.size[0], this.data.size[1]);

        for (let i = 0; i < this.data.in.length; i++) {
            let j = i * 4;
            inImgData.data[j] = inImgData.data[j + 1] = inImgData.data[j + 2] = this.data.in[i];
            inImgData.data[j + 3] = 255;
        }
        NetView.putImageData(this.dist, inImgData, (this.width - this.data.size[0]) / 2, this.vpos);
        this.vpos += this.data.size[1] + VSTEP;

        this.data.layers.forEach((layer: any) => {
            switch (layer.type) {
                case 'conv': return this.processConvLayer(layer);
                case 'pool': return this.processPoolLayer(layer);
                case 'fc': return this.processFCLayer(layer);
                case 'output': return this.processOutputLayer(layer);
            }
        });

        return this.dist;
    }

    processConvLayer(layer: any) {
        let count = layer.inCount * layer.count;
        let bw = count * (layer.outSize[0] + HSTEP) - HSTEP;
        let startx = (this.width - bw) / 2;
        let step = layer.outSize[0] + HSTEP;
        for (let k = 0; k < layer.inCount * layer.count; k++) {
            let imData = NetView.createImageData(layer.outSize[0], layer.outSize[1]);
            let offset = k * layer.outSize[0] * layer.outSize[1];

            for (let i = 0; i < layer.out.length; i++) {
                let j = i * 4;
                imData.data[j] = imData.data[j + 1] = imData.data[j + 2] = layer.out[i + offset] * 255;
                imData.data[j + 3] = 255;
            }

            NetView.putImageData(this.dist, imData, startx + k * step, this.vpos);
        }

        this.vpos += layer.outSize[1] + VSTEP;
    }

    processPoolLayer(layer: any) {
        let bw = layer.count * (layer.outSize[0] + HSTEP) - HSTEP;
        let startx = (this.width - bw) / 2;
        let step = layer.outSize[0] + HSTEP;
        for (let k = 0; k < layer.count; k++) {
            let imData = NetView.createImageData(layer.outSize[0], layer.outSize[1]);
            let offset = k * layer.outSize[0] * layer.outSize[1];

            for (let i = 0; i < layer.out.length; i++) {
                let j = i * 4;
                imData.data[j] = imData.data[j + 1] = imData.data[j + 2] = layer.out[i + offset] * 255;
                imData.data[j + 3] = 255;
            }

            NetView.putImageData(this.dist, imData, startx + k * step, this.vpos);
        }
        this.vpos += layer.outSize[1] + VSTEP;
    }

    processFCLayer(layer: any) {
        let lineCount = Math.floor(this.width / (FC_SIZE + 1));
        let preSize = layer.out.length * (FC_SIZE + 1) - 1;
        let blockHeight = Math.ceil(preSize / lineCount);
        let xoffset = lineCount < layer.out.length ? 0 : (this.width - preSize) / 2;

        let j = 0, k = 0;
        for (let i = 0; i < layer.out.length; i++, j++) {
            if (j >= lineCount) {
                j = 0;
                k++;
            }
            let x = j * (FC_SIZE + 1) + xoffset,
                c = Math.floor(layer.out[i] * 255);

            NetView.fillRect(this.dist, x, this.vpos + k * (FC_SIZE + 1), FC_SIZE, FC_SIZE, c);
        }

        this.vpos += blockHeight + VSTEP;
    }

    processOutputLayer(layer: any) {
        let lineCount = Math.floor(this.width / (OUT_SIZE + 1));
        let blockHeight = Math.ceil(layer.out.length * OUT_SIZE / lineCount);
        let xoffset = lineCount < layer.out.length ? 0 : (this.width - layer.out.length * (OUT_SIZE + 1) - 1) / 2;

        let j = 0, k = 0;
        for (let i = 0; i < layer.out.length; i++, j++) {
            if (j >= lineCount) {
                j = 0;
                k++;
            }
            let x = j * (OUT_SIZE + 1) + xoffset,
                c = Math.floor(layer.out[i] * 255);

            NetView.fillRect(this.dist, x, this.vpos + k * (OUT_SIZE + 1), OUT_SIZE, OUT_SIZE, c);
        }

        this.vpos += blockHeight + VSTEP;
    }
}
