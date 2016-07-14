package interfaces

import (
	"image"
)

type INet interface {
	Init()
	GetSize() []int
	GetInput() []float64
	SetOutput([]float64)
	SetError(float64)
	Train(TrainParams, map[image.Image][]float64)
	Test(image.Image)
}
