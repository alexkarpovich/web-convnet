package layers

import (
	"github.com/alexkarpovich/convnet/api/convnet/interfaces"
)

type LayerClass int
const (
	CONV LayerClass = 1+iota
	POOL
	FC
	OUTPUT
)

func GetClass(class string) LayerClass {
	switch class {
	case "conv": return CONV;
	case "pool": return POOL;
	case "fc": return FC;
	case "output": return OUTPUT;
	}

	return OUTPUT;
}

type ILayer interface {
	Init(interfaces.INet, string, []int)
	SetPrev(ILayer)
	SetNext(ILayer)
	Prepare()
	GetProp(string) interface{}
	FeedForward()
	BackProp()
}

type Layer struct {
	net interfaces.INet
	class LayerClass
	prev ILayer
	next ILayer
	size []int
	S []float64
	out []float64
}

func (l Layer) Init(net interfaces.INet, class string, size []int) {
	l.net = net
	l.class = GetClass(class)
	l.size = size
}

func (l Layer) SetPrev(prevLayer ILayer) {
	l.prev = prevLayer
}

func (l Layer) SetNext(nextLayer ILayer) {
	l.next = nextLayer
}
