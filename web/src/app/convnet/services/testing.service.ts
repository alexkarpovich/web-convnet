import {Injectable} from '@angular/core';

interface IPoint {
    x: number
    y: number
}

@Injectable()
export class TestingService {
    private _points: IPoint[] = [];
    private _dragging: boolean[] = [];

    get points():IPoint[] {
        return this._points;
    }

    get dragging(): boolean[] {
        return this._dragging;
    }

    addPoint(x: number, y: number, dragging: boolean) {
        this._points.push({x: x * 28 / 400, y: y * 28 / 400});
        this._dragging.push(dragging);
    }

    clear() {
        this._points = [];
        this._dragging = [];
    }

    convertToRaw(context: CanvasRenderingContext2D): number[] {
        let rawImage = [];
        let imageData = context.getImageData(0, 0, 28, 28);

        for (let i = 0; i < imageData.data.length; i += 4) {
            rawImage.push(imageData.data[i]);
        }

        return rawImage;
    }
}
