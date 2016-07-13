package interfaces

import (
	"image"
)

type INet interface {
	Init()
	GetSize() []int
	SetOutput([]float64)
	Train()
	Test(image.Image)
}
