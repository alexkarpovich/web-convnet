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

func (l *ConvLayer) Construct(shape string, count int) {
	l.shape = GetShape(shape)
	l.count = count
}

func (l *ConvLayer) Prepare() {
	fmt.Println(l.GetProp("count").(int))
	length := l.count*l.size[0]*l.size[1]
	l.kernels = make([]float32, length)

	for i := 0; i < length; i++ {
		l.kernels[i] = rand.Float32()*2-1
	}
}

func (l *ConvLayer) GetProp(name string) interface{} {
	switch name {
	case "count": return l.count
	case "kernelSize": return l.size
	case "outSize": return l.getOutSize()
	}

	return nil
}

func (l *ConvLayer) FeedForward() {

}

func (l *ConvLayer) BackProp() {

}

func (l *ConvLayer) getOutSize() []int {
	inSize := l.net.GetSize()

	switch l.shape {
	case VALID: return []int{inSize[0]-l.size[0]+1, inSize[1]-l.size[1]+1}
	case SAME: return []int{inSize[0], inSize[1]}
	case FULL: return []int{inSize[0]+l.size[0]-1, inSize[1]+l.size[1]-1}
	}

	return inSize
}