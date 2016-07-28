export interface ITrainParams {
    maxIterations: number
    minError: number
    learningRate: number
}

export interface IMessage {
    type: string
    data: any
}
