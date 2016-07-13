package layers

import (
	"fmt"
)

type OutputLayer struct {
	*Layer
}

func (l OutputLayer) Prepare() {
	fmt.Println(l.class)
}

func (l OutputLayer) FeedForward() {

}

func (l OutputLayer) BackProp() {

}

