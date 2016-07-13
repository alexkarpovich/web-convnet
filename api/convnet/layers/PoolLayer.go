package layers

import (
	"fmt"
)

type PoolLayer struct {
	*Layer
	count int
}

func (l PoolLayer) Prepare() {
	fmt.Println(l.class)
	l.count = l.prev.GetProp("count").(int)
}

func (l PoolLayer) FeedForward() {

}

func (l PoolLayer) BackProp() {

}

func (l PoolLayer) GetProp(name string) interface{} {
	switch name {
	case "count": return l.count
	case "kernelSize": return l.size
	case "outSize": return l.getOutSize()
	}

	return nil
}

func (l PoolLayer) getOutSize() []int {
	inSize := l.GetProp("outSize").([]int)

	return []int{inSize[0]/l.size[0], inSize[1]/l.size[1]}
}

