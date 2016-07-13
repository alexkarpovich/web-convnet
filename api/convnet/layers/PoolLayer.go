package layers

import (
	"fmt"
)

type PoolLayer struct {
	*Layer
}

func (l PoolLayer) Prepare() {
	fmt.Println(l.class)
}

func (l PoolLayer) FeedForward() {

}

func (l PoolLayer) BackProp() {

}

