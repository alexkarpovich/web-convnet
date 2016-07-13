package layers

import (
	"fmt"
	"math/rand"
)

type ConvShape int
const (
	VALID ConvShape=1+iota
	SAME
	FULL
)

func GetShape(shape string) ConvShape {
	switch shape {
	case "valid": return VALID;
	case "same": return SAME;
	case "full": return FULL;
	}
	return FULL;
}

type ConvLayer struct {
	*Layer
	shape ConvShape
	count int
	kernels []float32
}

func (l ConvLayer) Construct(shape string, count int) {
	l.shape = GetShape(shape)
	l.count = count
}

func (l ConvLayer) Prepare() {
	fmt.Println(l.class)
	length := l.count*l.size[0]*l.size[1]
	l.kernels = make([]float32, length)

	for i := 0; i < length; i++ {
		l.kernels[i] = rand.Float32()*2-1
	}
}

func (l ConvLayer) FeedForward() {

}

func (l ConvLayer) BackProp() {

}