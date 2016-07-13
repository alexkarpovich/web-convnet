package layers

import (
	//"fmt"
	"math/rand"
	. "github.com/alexkarpovich/convnet/api/convnet/utils"
)

type FCLayer struct {
	*Layer
	weights [][]float64
}

func (l *FCLayer) Prepare() {
	inSize := l.prev.GetProp("outSize").([]int)
	count := l.prev.GetProp("count").(int)
	length := count * inSize[0] * inSize[1]

	l.weights = make([][]float64, length)
	for i:=0; i<length; i++ {
		l.weights[i] = make([]float64, l.size[0])

		for j:=0; j<l.size[0]; j++ {
			l.weights[i][j] = rand.Float64()*2-1
		}
	}

	l.in = make([]float64, l.size[0])
	l.out = make([]float64, l.size[0])
}

func (l *FCLayer) FeedForward() {
	prevOut := l.prev.GetProp("out").([]float64)
	prevLength := len(prevOut)

	for j:=0; j<l.size[0]; j++ {
		s := 0.0

		for i:=0; i<prevLength; i++ {
			s += prevOut[i] * l.weights[i][j]
		}

		l.in[j] = s
		l.out[j] = Sigmoid(s)
	}
}

func (l *FCLayer) BackProp() {

}

func (l *FCLayer) GetProp(name string) interface{} {
	switch name {
	case "outSize": return l.size
	}

	return nil
}
