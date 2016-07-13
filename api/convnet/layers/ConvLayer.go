package layers

import (
	//"fmt"
	"math/rand"
	. "github.com/alexkarpovich/convnet/api/convnet/utils"
)

type ConvLayer struct {
	*Layer
	shape string
	count int
	kernels []float64
	im []float64
}

func (l *ConvLayer) Construct(shape string, count int) {
	l.shape = shape
	l.count = count
}

func (l *ConvLayer) Prepare() {
	length := l.count*l.size[0]*l.size[1]
	l.kernels = make([]float64, length)

	for i := 0; i < length; i++ {
		l.kernels[i] = rand.Float64()*2-1
	}

	outSize := l.getOutSize()

	l.in = make([]float64, outSize[0]*outSize[1]*l.count)
	l.im = make([]float64, outSize[0]*outSize[1])
	l.out = make([]float64, outSize[0]*outSize[1]*l.count)
}

func (l *ConvLayer) GetProp(name string) interface{} {
	switch name {
	case "count": return l.count
	case "kernelSize": return l.size
	case "outSize": return l.getOutSize()
	case "out": return l.out
	}

	return nil
}

func (l *ConvLayer) FeedForward() {
	data, outSize := PrepareInput(l.net.GetInput(), l.shape, l.net.GetSize(), l.size)
	l.im = data
	p := 0
	kStep := l.size[0]*l.size[1]
	iRange := outSize[0]-l.size[0]
	jRange := outSize[1]-l.size[1]

	for k:=0; k<l.count; k++ {
		kOffset := kStep * k

		for j:=0; j<jRange; j++ {
			for i:=0; i<iRange; i++ {
				v := 0.0
				highIndex := i+outSize[0]*j

				for b:=0; b<l.size[1]; b++ {
					for a:=0; a<l.size[0]; a++ {
						v += data[highIndex+a+b*outSize[0]] * l.kernels[a+l.size[0]*b+kOffset];
					}
				}

				l.in[p] = v
				l.out[p] = Sigmoid(v)
				p++
			}
		}
	}
}

func (l *ConvLayer) BackProp() {

}

func (l *ConvLayer) getOutSize() []int {
	inSize := l.net.GetSize()

	switch l.shape {
	case "valid": return []int{inSize[0]-l.size[0]+1, inSize[1]-l.size[1]+1}
	case "same": return []int{inSize[0], inSize[1]}
	case "full": return []int{inSize[0]+l.size[0]-1, inSize[1]+l.size[1]-1}
	}

	return inSize
}