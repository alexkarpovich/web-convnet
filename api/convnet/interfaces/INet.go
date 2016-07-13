package interfaces

import (
	"image"
)

type INet interface {
	Init()
	GetSize() []int
	GetInput() []float64
	SetOutput([]float64)
	Train()
	Test(image.Image)
}
