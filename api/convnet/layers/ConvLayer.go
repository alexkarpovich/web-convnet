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
	inCount int
	imSize []int
	kernels []float64
	im []float64
	deltas []float64
}

func (l *ConvLayer) Construct(shape string, count int) {
	l.shape = shape
	l.count = count
	l.inCount = 1
}

func (l *ConvLayer) Prepare() {
	length := l.count*l.size[0]*l.size[1]
	l.kernels = make([]float64, length)

	for i := 0; i < length; i++ {
		l.kernels[i] = rand.Float64()*2-1
	}

	outSize := l.getOutSize()

	l.imSize = make([]int, 2)
	l.in = make([]float64, outSize[0]*outSize[1]*l.count)
	l.im = make([]float64, outSize[0]*outSize[1])
	l.out = make([]float64, outSize[0]*outSize[1]*l.count)
	l.deltas = make([]float64, outSize[0]*outSize[1]*l.count)
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
	isFirst := true
	input := l.net.GetInput()
	inputSize := l.net.GetSize()
	var prevOut []float64

	if l.prev != nil {
		prevClass := l.prev.GetClass()
		isFirst = false

		if prevClass=="conv" || prevClass=="pool" {
			l.inCount = l.prev.GetProp("count").(int)
			inputSize = l.prev.GetProp("outSize").([]int)
			prevOut = l.prev.GetProp("out").([]float64)
		}
	}

	l.im = []float64{}
	length := inputSize[0]*inputSize[1]

	for z:=0; z<l.inCount; z++ {
		if isFirst == false {
			input = prevOut[z*length:z*length+length]
		}

		data, outSize := PrepareInput(input, l.shape, inputSize, l.size)

		p := z*outSize[0]*outSize[1]
		kStep := l.size[0] * l.size[1]
		iRange := outSize[0] - l.size[0]
		jRange := outSize[1] - l.size[1]

		for k := 0; k < l.count; k++ {
			kOffset := kStep * k

			for j := 0; j < jRange; j++ {
				for i := 0; i < iRange; i++ {
					v := 0.0
					highIndex := i + outSize[0] * j

					for b := 0; b < l.size[1]; b++ {
						for a := 0; a < l.size[0]; a++ {
							v += data[highIndex + a + b * outSize[0]] * l.kernels[a + l.size[0] * b + kOffset];
						}
					}

					l.in[p] = v
					l.out[p] = Sigmoid(v)
					p++
				}
			}
		}

		l.im = append(l.im, data...)
		l.imSize = outSize
	}
}

func (l *ConvLayer) BackProp() {
	alpha := 0.001;
	nextDeltas := l.next.GetProp("deltas").([]float64);
	subsize := l.next.GetProp("size").([]int);
	convSize := l.getOutSize();
	p := 0
	sSize := subsize[0]*subsize[1]
	cSize := convSize[0]*convSize[1]

	for k:=0; k<l.count; k++ {
		offset := k*cSize;
		for j:=0; j<convSize[1]; j+=subsize[1] {
			for i:=0; i<convSize[0]; i+=subsize[0] {
				delta := nextDeltas[p]/float64(sSize)
				highIndex := i+convSize[0]*j

				for b:=0; b<subsize[1]; b++ {
					for a:=0; a<subsize[0]; a++ {
						l.deltas[highIndex+a+b*convSize[0]+offset] = delta;
					}
				}
				p++
			}
		}
	}

	iRange := l.imSize[0]-l.size[0];
	jRange := l.imSize[1]-l.size[1];
	p = 0;

	for k:=0; k<l.count; k++ {
		offset := k*sSize

		for j:=0; j<jRange; j++ {
			for i:=0; i<iRange; i++ {
				highIndex := i+l.imSize[0]*j;

				for b:=0; b<l.size[1]; b++ {
					for a:=0; a<l.size[0]; a++ {
						l.kernels[a+l.size[0]*b+offset] +=
							alpha*l.deltas[p]*DSigmoid(l.in[p])*l.im[highIndex+a+b*l.imSize[0]];
					}
				}

				p++
			}
		}
	}
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