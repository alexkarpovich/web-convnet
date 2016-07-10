export class Utils {
    public static img2data(srcData):number[] {
        let result = [];
        let d = srcData.data;

        for (let i=0,j=0;i<srcData.data.length;i+=4) {
            result[j++] = 0.2989*d[i] + 0.5870*d[i+1] + 0.1140*d[i+2];
        }

        return result;
    }

    public static getRandom(min, max) {
      return Math.random() * (max - min) + min;
    }

    public static sigmoid(S:number) {
        return 1/(1+Math.exp(-S));
    }

    public static sigmoidDerivative(S:number) {
        let x = Utils.sigmoid(S);
        
        return x * (1 - x);
    }
}
