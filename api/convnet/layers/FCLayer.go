package layers

import (
	//"fmt"
)

type FCLayer struct {
	*Layer
	weights []float32
}

func (l *FCLayer) Prepare() {
	//size := l.net.GetSize()
	//fmt.Println(size)

}

func (l *FCLayer) FeedForward() {

}

func (l *FCLayer) BackProp() {

}

func (l *FCLayer) GetProp(name string) interface{} {
	switch name {
	case "outSize": return l.size
	}

	return nil
}
