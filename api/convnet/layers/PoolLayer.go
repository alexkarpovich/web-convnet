package layers

import (
	//"fmt"
	"math"
)

type PoolLayer struct {
	*Layer
	count int
	deltas []float64
}

func (l *PoolLayer) Prepare() {
	outSize := l.getOutSize()
	l.count = l.prev.GetProp("count").(int)
	l.out = make([]float64, l.count*outSize[0]*outSize[1])
	l.deltas = make([]float64, l.count*outSize[0]*outSize[1])
}

func (l *PoolLayer) FeedForward() {
	prevOut := l.prev.GetProp("out").([]float64)
	inSize := l.prev.GetProp("outSize").([]int)
	p := 0
	step := inSize[0]*inSize[1]

	for k:=0; k<l.count; k++ {
		offset := step * k

		for j:=0; j<inSize[1]; j+=l.size[1] {
			for i:=0; i<inSize[0]; i+=l.size[0] {
				highIndex := i+inSize[0]*j
				max := prevOut[highIndex+0+offset]

				for b:=0; b<l.size[1]; b++ {
					for a:=0; a<l.size[0]; a++ {
						max = math.Max(max, prevOut[highIndex+a+b*inSize[0]+offset]);
					}
				}

				//l.in[p] = max
				l.out[p] = max
				p++
			}
		}
	}
}

func (l *PoolLayer) BackProp() {
	nextDeltas := l.next.GetProp("deltas").([]float64);
	nextIn := l.next.GetProp("in").([]float64);
	nextWeights := l.next.GetProp("weights").([][]float64);

	for i:=0; i<len(l.out); i++ {
		v := 0.0;

		for k:=0; k<len(nextIn); k++ {
			v -= nextDeltas[k]*nextIn[k]*nextWeights[i][k];
		}

		l.deltas[i] = v;
	}
}

func (l *PoolLayer) GetProp(name string) interface{} {
	switch name {
	case "count": return l.count
	case "size": return l.size
	case "outSize": return l.getOutSize()
	case "out": return l.out
	case "deltas": return l.deltas
	}

	return nil
}

func (l *PoolLayer) getOutSize() []int {
	inSize := l.prev.GetProp("outSize").([]int)

	return []int{inSize[0]/l.size[0], inSize[1]/l.size[1]}
}

